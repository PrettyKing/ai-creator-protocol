import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database/services'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 开始初始化数据...')

    // 测试钱包地址
    const testAddresses = [
      '0x1234567890123456789012345678901234567890',
      '0x2345678901234567890123456789012345678901',
      '0x3456789012345678901234567890123456789012',
      '0x4567890123456789012345678901234567890123',
      '0x5678901234567890123456789012345678901234'
    ]

    const results = {
      users: 0,
      assets: 0,
      licenses: 0,
      earnings: 0,
      errors: []
    }

    for (const address of testAddresses) {
      try {
        console.log(`📝 为钱包 ${address} 创建数据...`)

        // 为每个用户创建2-5个IP资产
        const assetCount = Math.floor(Math.random() * 4) + 2

        for (let i = 0; i < assetCount; i++) {
          const assetTypes = ['image', 'video', 'audio', 'text', 'code']
          const assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)]

          const titles = {
            image: ['AI艺术作品', '数字插画', '概念设计', '摄影作品', '3D渲染'],
            video: ['创意短片', '教学视频', '产品演示', '动画作品', '纪录片段'],
            audio: ['原创音乐', '播客节目', '音效设计', '有声读物', '配音作品'],
            text: ['技术文章', '创意小说', '产品文档', '研究报告', '诗歌作品'],
            code: ['开源项目', '算法实现', '工具脚本', '框架组件', '智能合约']
          }

          const title = titles[assetType][Math.floor(Math.random() * titles[assetType].length)] + ` #${i + 1}`

          // 创建社交媒体数据（有50%概率）
          const socialMetrics = Math.random() > 0.5 ? {
            platform: (['tiktok', 'xiaohongshu', 'instagram', 'weibo'] as const)[Math.floor(Math.random() * 4)],
            followers: Math.floor(Math.random() * 100000) + 1000,
            views: Math.floor(Math.random() * 1000000) + 5000,
            likes: Math.floor(Math.random() * 50000) + 100,
            comments: Math.floor(Math.random() * 1000) + 10,
            shares: Math.floor(Math.random() * 500) + 5
          } : undefined

          // 创建IP资产
          const result = await DatabaseService.createIPAsset({
            title: title,
            description: `这是一个${assetType}类型的创作内容，展示了创作者的独特视角和技能。通过AI创作者协议保护版权并实现价值变现。`,
            creatorAddress: address,
            contentType: assetType,
            contentHash: `Qm${Math.random().toString(36).substring(2, 15)}${Date.now()}`,
            metadataHash: `Qm${Math.random().toString(36).substring(2, 15)}${Date.now()}`,
            socialUrl: socialMetrics ? `https://${socialMetrics.platform}.com/post/${Math.random().toString(36)}` : undefined,
            socialMetrics: socialMetrics,
            contentScore: Math.floor(Math.random() * 40) + 60, // 60-100分
            grade: ['C', 'B', 'A', 'A+'][Math.floor(Math.random() * 4)]
          })

          if (result.success && result.data?.id) {
            results.assets++

            // 创建许可证条款
            const licenseResult = await DatabaseService.createLicenseTerms(result.data.id, {
              commercialUse: Math.random() > 0.5,
              derivatives: Math.random() > 0.5,
              attribution: true,
              shareAlike: Math.random() > 0.3,
              territory: ['全球'],
              channels: ['社交媒体', '网站博客', '商业广告'],
              timeframe: Math.floor(Math.random() * 36) + 12, // 12-48个月
              royalty: Math.floor(Math.random() * 20) + 5 // 5-25%
            })

            if (licenseResult.success) {
              results.licenses++
            }

            // 随机设置一些资产为已确权状态
            if (Math.random() > 0.4) {
              await DatabaseService.updateIPAsset(result.data.id, {
                status: 'registered',
                ip_asset_id: '0x' + Math.random().toString(16).substring(2, 42)
              })

              // 为已确权资产创建收益记录
              if (Math.random() > 0.3) {
                const earningsCount = Math.floor(Math.random() * 3) + 1

                for (let j = 0; j < earningsCount; j++) {
                  const earningResult = await DatabaseService.recordEarnings({
                    userAddress: address,
                    ipAssetId: result.data.id,
                    amount: Math.floor(Math.random() * 500) + 50, // 50-550
                    tokenSymbol: ['ETH', 'USDT', 'ACP'][Math.floor(Math.random() * 3)],
                    source: ['license', 'royalty', 'reward'][Math.floor(Math.random() * 3)]
                  })

                  if (earningResult.success) {
                    results.earnings++
                  }
                }
              }
            }
          }
        }

        results.users++
        console.log(`✅ 完成钱包 ${address} 的数据创建`)

      } catch (error) {
        console.error(`❌ 处理钱包 ${address} 时出错:`, error)
        results.errors.push(`钱包 ${address}: ${error}`)
      }
    }

    console.log('🎉 数据初始化完成!')

    return NextResponse.json({
      success: true,
      message: '数据初始化完成',
      data: {
        summary: `成功创建 ${results.users} 个用户的数据，包含 ${results.assets} 个资产、${results.licenses} 个许可证条款、${results.earnings} 条收益记录`,
        details: results,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('初始化数据错误:', error)
    return NextResponse.json(
      {
        success: false,
        error: '数据初始化失败',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}