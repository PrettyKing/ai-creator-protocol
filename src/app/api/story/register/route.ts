import { NextRequest, NextResponse } from 'next/server'
import { StoryProtocolSDK, IPAssetData } from '@/lib/story-protocol'
import { ContentScorer } from '@/lib/scoring'

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

    // 注册IP资产
    const registerResult = await storySDK.registerIPAsset(ipAssetData)

    if (!registerResult.success) {
      return NextResponse.json(
        { error: registerResult.error || 'IP资产注册失败' },
        { status: 500 }
      )
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

    // 计算代币奖励（如果提供了社交媒体数据）
    let rewardAmount = 0
    let contentScore = 0
    
    if (socialMetrics) {
      contentScore = ContentScorer.calculateScore(socialMetrics)
      rewardAmount = ContentScorer.getRewardAmount(contentScore)
    }

    // 返回注册结果
    return NextResponse.json({
      success: true,
      data: {
        ipAssetId: registerResult.ipAssetId,
        tokenId: registerResult.tokenId,
        contractAddress: registerResult.contractAddress,
        txHash: registerResult.txHash,
        contentScore,
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