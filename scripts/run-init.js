// 直接运行数据初始化的简化脚本
console.log('🚀 开始初始化数据...')

// 模拟数据结构
const mockData = {
  users: [],
  assets: [],
  licenseTerms: [],
  earnings: [],
  generatedAt: new Date().toISOString()
}

// 测试钱包地址
const testAddresses = [
  '0x1234567890123456789012345678901234567890',
  '0x2345678901234567890123456789012345678901',
  '0x3456789012345678901234567890123456789012',
  '0x4567890123456789012345678901234567890123',
  '0x5678901234567890123456789012345678901234'
]

const assetTypes = ['image', 'video', 'audio', 'text', 'code']
const titles = {
  image: ['AI艺术作品', '数字插画', '概念设计', '摄影作品', '3D渲染'],
  video: ['创意短片', '教学视频', '产品演示', '动画作品', '纪录片段'],
  audio: ['原创音乐', '播客节目', '音效设计', '有声读物', '配音作品'],
  text: ['技术文章', '创意小说', '产品文档', '研究报告', '诗歌作品'],
  code: ['开源项目', '算法实现', '工具脚本', '框架组件', '智能合约']
}

const platforms = ['tiktok', 'xiaohongshu', 'instagram', 'weibo']
const statuses = ['pending', 'registered', 'failed']
const grades = ['C', 'B', 'A', 'A+']
const tokenSymbols = ['ETH', 'USDT', 'ACP']
const sources = ['license', 'royalty', 'reward']

testAddresses.forEach((address, userIndex) => {
  console.log(`📝 创建用户 ${address}...`)

  // 创建用户
  const user = {
    id: `user_${userIndex + 1}`,
    wallet_address: address,
    username: `用户_${address.slice(-4)}`,
    email: null,
    avatar_url: null,
    created_at: new Date().toISOString(),
    last_login: null
  }
  mockData.users.push(user)

  // 为每个用户创建2-5个IP资产
  const assetCount = Math.floor(Math.random() * 4) + 2
  console.log(`  📄 创建 ${assetCount} 个资产...`)

  for (let i = 0; i < assetCount; i++) {
    const assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)]
    const titleOptions = titles[assetType]
    const title = titleOptions[Math.floor(Math.random() * titleOptions.length)] + ` #${i + 1}`
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const assetId = `asset_${userIndex + 1}_${i + 1}`

    // 50%概率有社交媒体数据
    const hasSocialData = Math.random() > 0.5
    const socialMetrics = hasSocialData ? {
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      followers: Math.floor(Math.random() * 100000) + 1000,
      views: Math.floor(Math.random() * 1000000) + 5000,
      likes: Math.floor(Math.random() * 50000) + 100,
      comments: Math.floor(Math.random() * 1000) + 10,
      shares: Math.floor(Math.random() * 500) + 5
    } : null

    const asset = {
      id: assetId,
      title: title,
      description: `这是一个${assetType}类型的创作内容，展示了创作者的独特视角和技能。通过AI创作者协议保护版权并实现价值变现。`,
      creator_id: user.id,
      creator_address: address,
      content_type: assetType,
      content_hash: `Qm${Math.random().toString(36).substring(2, 15)}${Date.now()}`,
      metadata_hash: `Qm${Math.random().toString(36).substring(2, 15)}${Date.now()}`,
      social_url: hasSocialData ? `https://${socialMetrics.platform}.com/post/${Math.random().toString(36)}` : null,
      social_metrics: socialMetrics,
      content_score: Math.floor(Math.random() * 40) + 60, // 60-100分
      grade: grades[Math.floor(Math.random() * grades.length)],
      tx_hash: null,
      contract_address: null,
      token_id: null,
      ip_asset_id: status === 'registered' ? `0x${Math.random().toString(16).substring(2, 42)}` : null,
      status: status,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // 最近30天内
      updated_at: new Date().toISOString()
    }
    mockData.assets.push(asset)

    // 创建许可证条款
    const licenseTerms = {
      id: `license_${assetId}`,
      ip_asset_id: assetId,
      commercial_use: Math.random() > 0.5,
      derivatives: Math.random() > 0.5,
      attribution: true,
      share_alike: Math.random() > 0.3,
      territory: ['全球'],
      channels: ['社交媒体', '网站博客', '商业广告'],
      timeframe: Math.floor(Math.random() * 36) + 12, // 12-48个月
      royalty: Math.floor(Math.random() * 20) + 5, // 5-25%
      created_at: new Date().toISOString()
    }
    mockData.licenseTerms.push(licenseTerms)

    // 如果是已注册状态，创建收益记录
    if (status === 'registered' && Math.random() > 0.3) {
      const earningsCount = Math.floor(Math.random() * 3) + 1

      for (let j = 0; j < earningsCount; j++) {
        const earning = {
          id: `earning_${assetId}_${j + 1}`,
          user_id: user.id,
          ip_asset_id: assetId,
          amount: Math.floor(Math.random() * 500) + 50, // 50-550
          token_symbol: tokenSymbols[Math.floor(Math.random() * tokenSymbols.length)],
          source: sources[Math.floor(Math.random() * sources.length)],
          tx_hash: `0x${Math.random().toString(16).substring(2, 66)}`,
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() // 最近7天内
        }
        mockData.earnings.push(earning)
      }

      console.log(`    💰 创建了 ${earningsCount} 条收益记录`)
    }

    console.log(`    ✅ 创建资产: ${title} (${status})`)
  }

  console.log(`✅ 完成用户 ${address}`)
})

// 保存数据到文件
const fs = require('fs')
const path = require('path')

const outputPath = path.join(process.cwd(), 'src', 'data', 'mock-data.json')

// 确保目录存在
const dir = path.dirname(outputPath)
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

fs.writeFileSync(outputPath, JSON.stringify(mockData, null, 2))

// 统计信息
const stats = {
  users: mockData.users.length,
  assets: mockData.assets.length,
  licenseTerms: mockData.licenseTerms.length,
  earnings: mockData.earnings.length,
  registeredAssets: mockData.assets.filter(a => a.status === 'registered').length,
  totalEarnings: mockData.earnings.reduce((sum, e) => sum + e.amount, 0)
}

console.log('\n🎉 数据初始化完成!')
console.log(`📁 数据已保存到: ${outputPath}`)
console.log('\n📊 统计信息:')
console.log(`  👥 用户: ${stats.users}`)
console.log(`  📄 资产: ${stats.assets} (其中 ${stats.registeredAssets} 个已确权)`)
console.log(`  📜 许可证条款: ${stats.licenseTerms}`)
console.log(`  💰 收益记录: ${stats.earnings} 条，总计 ${stats.totalEarnings} 代币`)

console.log('\n🌐 现在可以访问以下页面查看数据:')
console.log('  • 主页: http://localhost:3003')
console.log('  • 仪表板: http://localhost:3003/dashboard')
console.log('  • 管理页面: http://localhost:3003/admin')
console.log('  • 测试页面: http://localhost:3003/test-styles')