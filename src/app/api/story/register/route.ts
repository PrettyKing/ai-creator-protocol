import { NextRequest, NextResponse } from 'next/server'
import { StoryProtocolSDK, IPAssetData } from '@/lib/story-protocol'
import { ContentScorer } from '@/lib/scoring'
import { DatabaseService } from '@/lib/database/services'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      description, 
      contentHash, 
      metadataHash, 
      creator, 
      licenseTerms,
      socialMetrics 
    } = body

    // 输入验证
    if (!title || !contentHash || !creator || !licenseTerms) {
      return NextResponse.json(
        { error: '缺少必要的注册信息' },
        { status: 400 }
      )
    }

    // 钱包地址格式验证
    if (!/^0x[a-fA-F0-9]{40}$/.test(creator)) {
      return NextResponse.json(
        { error: '无效的钱包地址格式' },
        { status: 400 }
      )
    }

    // 创建Story Protocol SDK实例
    const storySDK = new StoryProtocolSDK()

    // 准备IP资产数据
    const ipAssetData: IPAssetData = {
      title,
      description: description || '',
      contentHash,
      metadataHash: metadataHash || contentHash,
      creator,
      licenseTerms
    }

    // 计算代币奖励（如果提供了社交媒体数据）
    let rewardAmount = 0
    let contentScore = 0
    let grade = 'D'

    if (socialMetrics) {
      contentScore = ContentScorer.calculateScore(socialMetrics)
      rewardAmount = ContentScorer.getRewardAmount(contentScore)
      grade = ContentScorer.getScoreGrade(contentScore).grade
    }

    // 首先在数据库中创建IP资产记录
    const dbAssetResult = await DatabaseService.createIPAsset({
      title,
      description: description || '',
      creatorAddress: creator,
      contentType: socialMetrics ? 'social-link' : 'file',
      contentHash,
      metadataHash: metadataHash || contentHash,
      socialUrl: socialMetrics ? body.socialUrl : undefined,
      socialMetrics,
      contentScore,
      grade
    })

    if (!dbAssetResult.success) {
      console.error('数据库创建IP资产失败:', dbAssetResult.error)
      // 不阻断流程，继续进行区块链注册
    }

    // 注册IP资产到区块链
    const registerResult = await storySDK.registerIPAsset(ipAssetData)

    if (!registerResult.success) {
      // 如果区块链注册失败，更新数据库状态
      if (dbAssetResult.success && dbAssetResult.data) {
        await DatabaseService.updateIPAsset(dbAssetResult.data.id, {
          status: 'failed'
        })
      }

      return NextResponse.json(
        { error: registerResult.error || 'IP资产注册失败' },
        { status: 500 }
      )
    }

    // 更新数据库中的区块链信息
    if (dbAssetResult.success && dbAssetResult.data) {
      await DatabaseService.updateIPAsset(dbAssetResult.data.id, {
        tx_hash: registerResult.txHash,
        contract_address: registerResult.contractAddress,
        token_id: registerResult.tokenId,
        ip_asset_id: registerResult.ipAssetId,
        status: 'completed'
      })

      // 创建授权条款记录
      if (licenseTerms) {
        await DatabaseService.createLicenseTerms(dbAssetResult.data.id, licenseTerms)
      }

      // 记录交易
      if (registerResult.txHash) {
        await DatabaseService.recordTransaction({
          ipAssetId: dbAssetResult.data.id,
          fromAddress: creator,
          txHash: registerResult.txHash,
          txType: 'register',
          status: 'confirmed'
        })
      }

      // 记录收益奖励
      if (rewardAmount > 0) {
        await DatabaseService.recordEarnings({
          userAddress: creator,
          ipAssetId: dbAssetResult.data.id,
          amount: rewardAmount,
          tokenSymbol: 'ACP', // AI Creator Protocol Token
          source: 'reward',
          txHash: registerResult.txHash
        })
      }
    }

    // 设置版税（如果指定）
    if (licenseTerms.royalty && licenseTerms.royalty > 0 && registerResult.ipAssetId) {
      const royaltyResult = await storySDK.setRoyalties(
        registerResult.ipAssetId,
        licenseTerms.royalty
      )

      if (!royaltyResult.success) {
        console.warn('版税设置失败:', royaltyResult.error)
      }
    }

    // 返回注册结果
    return NextResponse.json({
      success: true,
      data: {
        assetId: dbAssetResult.data?.id,
        ipAssetId: registerResult.ipAssetId,
        tokenId: registerResult.tokenId,
        contractAddress: registerResult.contractAddress,
        txHash: registerResult.txHash,
        contentScore,
        grade,
        rewardAmount,
        registeredAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Story Protocol注册API错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// 获取注册状态
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ipAssetId = searchParams.get('ipAssetId')

    if (!ipAssetId) {
      return NextResponse.json(
        { error: '缺少IP资产ID' },
        { status: 400 }
      )
    }

    const storySDK = new StoryProtocolSDK()
    const result = await storySDK.getIPAssetInfo(ipAssetId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || '获取信息失败' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data
    })

  } catch (error) {
    console.error('获取IP资产信息错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}