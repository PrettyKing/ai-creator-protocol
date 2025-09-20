import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database/services'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address } = body

    if (!address) {
      return NextResponse.json(
        { error: '缺少钱包地址' },
        { status: 400 }
      )
    }

    // 验证钱包地址格式
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: '无效的钱包地址格式' },
        { status: 400 }
      )
    }

    // 创建测试IP资产
    const testAssets = [
      {
        title: "AI艺术作品《数字梦境》",
        description: "使用AI技术创作的超现实主义艺术作品",
        creatorAddress: address,
        contentType: "image",
        contentHash: "QmTestHash1" + Date.now(),
        metadataHash: "QmMetaHash1" + Date.now(),
        contentScore: 85,
        grade: "A"
      },
      {
        title: "科技评测：未来智能手机",
        description: "深度评测最新科技产品的原创视频内容",
        creatorAddress: address,
        contentType: "video",
        contentHash: "QmTestHash2" + Date.now(),
        metadataHash: "QmMetaHash2" + Date.now(),
        socialUrl: "https://example.com/video",
        socialMetrics: {
          platform: "tiktok" as const,
          followers: 50000,
          views: 120000,
          likes: 8500,
          comments: 320,
          shares: 180
        },
        contentScore: 78,
        grade: "B"
      },
      {
        title: "原创音乐《星空下的思考》",
        description: "独立音乐人创作的电子音乐作品",
        creatorAddress: address,
        contentType: "audio",
        contentHash: "QmTestHash3" + Date.now(),
        metadataHash: "QmMetaHash3" + Date.now(),
        contentScore: 92,
        grade: "A+"
      }
    ]

    const createdAssets = []

    // 批量创建测试资产
    for (const assetData of testAssets) {
      const result = await DatabaseService.createIPAsset(assetData)
      if (result.success) {
        createdAssets.push(result.data)

        // 为每个资产创建示例许可证条款
        if (result.data?.id) {
          await DatabaseService.createLicenseTerms(result.data.id, {
            commercialUse: Math.random() > 0.5,
            derivatives: Math.random() > 0.5,
            attribution: true,
            shareAlike: Math.random() > 0.3,
            territory: ['全球'],
            channels: ['社交媒体', '网站博客'],
            timeframe: Math.floor(Math.random() * 36) + 12, // 12-48个月
            royalty: Math.floor(Math.random() * 20) + 5 // 5-25%
          })

          // 模拟一些收益记录
          if (Math.random() > 0.5) {
            await DatabaseService.recordEarnings({
              userAddress: address,
              ipAssetId: result.data.id,
              amount: Math.floor(Math.random() * 500) + 50, // 50-550
              tokenSymbol: 'ACP',
              source: 'reward'
            })
          }

          // 随机设置一些资产为已确权状态
          if (Math.random() > 0.4) {
            await DatabaseService.updateIPAsset(result.data.id, {
              status: 'registered',
              ip_asset_id: '0x' + Math.random().toString(16).substring(2, 42)
            })
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `成功创建 ${createdAssets.length} 个测试IP资产`,
      data: {
        createdCount: createdAssets.length,
        assets: createdAssets
      }
    })

  } catch (error) {
    console.error('创建测试数据错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// 清除测试数据
export async function DELETE(request: NextRequest) {
  try {
    // 这里可以添加清除测试数据的逻辑
    // 目前只返回成功响应

    return NextResponse.json({
      success: true,
      message: '测试数据清除功能尚未实现'
    })

  } catch (error) {
    console.error('清除测试数据错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}