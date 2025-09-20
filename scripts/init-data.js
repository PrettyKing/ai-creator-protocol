const { createClient } = require('@supabase/supabase-js')

// 从环境变量获取Supabase配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('⚠️  Supabase未配置，将生成模拟数据到本地文件')
  generateMockData()
} else {
  console.log('🔗 Supabase已配置，初始化真实数据...')
  initRealData()
}

async function initRealData() {
  const supabase = createClient(supabaseUrl, supabaseKey)

  // 测试钱包地址
  const testAddresses = [
    '0x1234567890123456789012345678901234567890',
    '0x2345678901234567890123456789012345678901',
    '0x3456789012345678901234567890123456789012',
    '0x4567890123456789012345678901234567890123',
    '0x5678901234567890123456789012345678901234'
  ]

  console.log('📝 创建测试用户...')

  for (const address of testAddresses) {
    // 创建用户
    const { data: user, error: userError } = await supabase
      .from('users')
      .upsert({
        wallet_address: address,
        username: `用户_${address.slice(-4)}`,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (userError) {
      console.error(`创建用户失败 ${address}:`, userError)
      continue
    }

    console.log(`✅ 创建用户: ${address}`)

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

      const statuses = ['pending', 'registered', 'failed']
      const status = statuses[Math.floor(Math.random() * statuses.length)]

      // 创建IP资产
      const { data: asset, error: assetError } = await supabase
        .from('ip_assets')
        .insert({
          title: title,
          description: `这是一个${assetType}类型的创作内容，展示了创作者的独特视角和技能。`,
          creator_address: address,
          content_type: assetType,
          content_hash: `Qm${Math.random().toString(36).substring(2, 15)}${Date.now()}`,
          metadata_hash: `Qm${Math.random().toString(36).substring(2, 15)}${Date.now()}`,
          content_score: Math.floor(Math.random() * 40) + 60, // 60-100分
          grade: ['C', 'B', 'A', 'A+'][Math.floor(Math.random() * 4)],
          status: status,
          ip_asset_id: status === 'registered' ? `0x${Math.random().toString(16).substring(2, 42)}` : null,
          created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // 最近30天内
        })
        .select()
        .single()

      if (assetError) {
        console.error(`创建IP资产失败:`, assetError)
        continue
      }

      console.log(`  📄 创建资产: ${title}`)

      // 创建许可证条款
      await supabase
        .from('license_terms')
        .insert({
          ip_asset_id: asset.id,
          commercial_use: Math.random() > 0.5,
          derivatives: Math.random() > 0.5,
          attribution: true,
          share_alike: Math.random() > 0.3,
          territory: ['全球'],
          channels: ['社交媒体', '网站博客', '商业广告'][Math.floor(Math.random() * 3)] ? ['社交媒体'] : ['网站博客'],
          timeframe: Math.floor(Math.random() * 36) + 12, // 12-48个月
          royalty: Math.floor(Math.random() * 20) + 5, // 5-25%
          created_at: new Date().toISOString()
        })

      // 如果是已注册状态，创建一些收益记录
      if (status === 'registered' && Math.random() > 0.4) {
        const earningsCount = Math.floor(Math.random() * 3) + 1

        for (let j = 0; j < earningsCount; j++) {
          await supabase
            .from('earnings')
            .insert({
              user_id: user.id,
              ip_asset_id: asset.id,
              amount: Math.floor(Math.random() * 500) + 50, // 50-550
              token_symbol: ['ETH', 'USDT', 'ACP'][Math.floor(Math.random() * 3)],
              source: ['license', 'royalty', 'reward'][Math.floor(Math.random() * 3)],
              created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() // 最近7天内
            })
        }

        console.log(`    💰 创建 ${earningsCount} 条收益记录`)
      }
    }
  }

  console.log('🎉 数据初始化完成!')
  console.log(`📊 创建了 ${testAddresses.length} 个用户和相关数据`)
}

function generateMockData() {
  const mockData = {
    users: [],
    assets: [],
    license_terms: [],
    earnings: [],
    generated_at: new Date().toISOString()
  }

  const testAddresses = [
    '0x1234567890123456789012345678901234567890',
    '0x2345678901234567890123456789012345678901',
    '0x3456789012345678901234567890123456789012',
    '0x4567890123456789012345678901234567890123',
    '0x5678901234567890123456789012345678901234'
  ]

  testAddresses.forEach((address, userIndex) => {
    // 创建用户
    const user = {
      id: `user_${userIndex + 1}`,
      wallet_address: address,
      username: `用户_${address.slice(-4)}`,
      created_at: new Date().toISOString()
    }
    mockData.users.push(user)

    // 为每个用户创建资产
    const assetCount = Math.floor(Math.random() * 4) + 2

    for (let i = 0; i < assetCount; i++) {
      const assetId = `asset_${userIndex + 1}_${i + 1}`
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
      const statuses = ['pending', 'registered', 'failed']
      const status = statuses[Math.floor(Math.random() * statuses.length)]

      const asset = {
        id: assetId,
        title: title,
        description: `这是一个${assetType}类型的创作内容，展示了创作者的独特视角和技能。`,
        creator_address: address,
        content_type: assetType,
        content_hash: `Qm${Math.random().toString(36).substring(2, 15)}${Date.now()}`,
        metadata_hash: `Qm${Math.random().toString(36).substring(2, 15)}${Date.now()}`,
        content_score: Math.floor(Math.random() * 40) + 60,
        grade: ['C', 'B', 'A', 'A+'][Math.floor(Math.random() * 4)],
        status: status,
        ip_asset_id: status === 'registered' ? `0x${Math.random().toString(16).substring(2, 42)}` : null,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }
      mockData.assets.push(asset)

      // 创建许可证条款
      mockData.license_terms.push({
        id: `license_${assetId}`,
        ip_asset_id: assetId,
        commercial_use: Math.random() > 0.5,
        derivatives: Math.random() > 0.5,
        attribution: true,
        share_alike: Math.random() > 0.3,
        territory: ['全球'],
        channels: ['社交媒体', '网站博客'],
        timeframe: Math.floor(Math.random() * 36) + 12,
        royalty: Math.floor(Math.random() * 20) + 5,
        created_at: new Date().toISOString()
      })

      // 创建收益记录
      if (status === 'registered' && Math.random() > 0.4) {
        const earningsCount = Math.floor(Math.random() * 3) + 1

        for (let j = 0; j < earningsCount; j++) {
          mockData.earnings.push({
            id: `earning_${assetId}_${j + 1}`,
            user_id: user.id,
            ip_asset_id: assetId,
            amount: Math.floor(Math.random() * 500) + 50,
            token_symbol: ['ETH', 'USDT', 'ACP'][Math.floor(Math.random() * 3)],
            source: ['license', 'royalty', 'reward'][Math.floor(Math.random() * 3)],
            created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
          })
        }
      }
    }
  })

  // 保存到文件
  const fs = require('fs')
  const path = require('path')

  const outputPath = path.join(process.cwd(), 'mock-data.json')
  fs.writeFileSync(outputPath, JSON.stringify(mockData, null, 2))

  console.log('🎉 模拟数据生成完成!')
  console.log(`📁 数据已保存到: ${outputPath}`)
  console.log(`📊 生成了 ${mockData.users.length} 个用户, ${mockData.assets.length} 个资产`)
}