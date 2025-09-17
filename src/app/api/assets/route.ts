import { NextRequest, NextResponse } from 'next/server'

// 模拟数据库，实际应用中应该使用真实的数据库
const mockDatabase = new Map<string, any[]>()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const creator = searchParams.get('creator')

    if (!creator) {
      return NextResponse.json(
        { error: '缺少creator参数' },
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

    // 从模拟数据库获取用户资产
    const userAssets = mockDatabase.get(creator) || []

    // 计算统计数据
    const stats = {
      totalAssets: userAssets.length,
      completedAssets: userAssets.filter(asset => asset.status === 'completed').length,
      processingAssets: userAssets.filter(asset => asset.status === 'processing').length,
      failedAssets: userAssets.filter(asset => asset.status === 'failed').length,
      totalEarnings: userAssets.reduce((sum, asset) => sum + (asset.earnings || 0), 0),
      totalViews: userAssets.reduce((sum, asset) => sum + (asset.views || 0), 0),
      totalRewards: userAssets.reduce((sum, asset) => sum + (asset.rewardAmount || 0), 0)
    }

    return NextResponse.json({
      success: true,
      data: {
        assets: userAssets,
        stats
      }
    })

  } catch (error) {
    console.error('获取用户资产API错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      creator,
      title,
      description,
      contentType,
      status,
      txHash,
      ipAssetId,
      contractAddress,
      contentScore,
      rewardAmount,
      contentHash,
      metadataHash
    } = body

    // 输入验证
    if (!creator || !title || !status) {
      return NextResponse.json(
        { error: '缺少必要的资产信息' },
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

    // 创建新资产记录
    const newAsset = {
      id: Date.now().toString(),
      title,
      description: description || '',
      contentType: contentType || 'unknown',
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      txHash: txHash || '',
      ipAssetId: ipAssetId || '',
      contractAddress: contractAddress || '',
      contentScore: contentScore || 0,
      rewardAmount: rewardAmount || 0,
      contentHash: contentHash || '',
      metadataHash: metadataHash || '',
      views: 0,
      earnings: 0
    }

    // 保存到模拟数据库
    const existingAssets = mockDatabase.get(creator) || []
    existingAssets.push(newAsset)
    mockDatabase.set(creator, existingAssets)

    return NextResponse.json({
      success: true,
      data: newAsset
    })

  } catch (error) {
    console.error('创建资产记录API错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      creator,
      assetId,
      updates
    } = body

    // 输入验证
    if (!creator || !assetId || !updates) {
      return NextResponse.json(
        { error: '缺少必要的更新信息' },
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

    // 从模拟数据库获取用户资产
    const userAssets = mockDatabase.get(creator) || []
    const assetIndex = userAssets.findIndex(asset => asset.id === assetId)

    if (assetIndex === -1) {
      return NextResponse.json(
        { error: '资产不存在' },
        { status: 404 }
      )
    }

    // 更新资产
    userAssets[assetIndex] = {
      ...userAssets[assetIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    mockDatabase.set(creator, userAssets)

    return NextResponse.json({
      success: true,
      data: userAssets[assetIndex]
    })

  } catch (error) {
    console.error('更新资产API错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}