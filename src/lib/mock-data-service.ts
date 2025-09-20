import mockData from '@/data/mock-data.json'

export interface MockUser {
  id: string
  wallet_address: string
  username: string
  email: string | null
  avatar_url: string | null
  created_at: string
  last_login: string | null
}

export interface MockAsset {
  id: string
  title: string
  description: string
  creator_id: string
  creator_address: string
  content_type: string
  content_hash: string
  metadata_hash: string
  social_url: string | null
  social_metrics: any
  content_score: number
  grade: string
  tx_hash: string | null
  contract_address: string | null
  token_id: string | null
  ip_asset_id: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface MockLicenseTerms {
  id: string
  ip_asset_id: string
  commercial_use: boolean
  derivatives: boolean
  attribution: boolean
  share_alike: boolean
  territory: string[]
  channels: string[]
  timeframe: number
  royalty: number
  created_at: string
}

export interface MockEarning {
  id: string
  user_id: string
  ip_asset_id: string
  amount: number
  token_symbol: string
  source: string
  tx_hash: string
  created_at: string
}

export class MockDataService {
  // 获取用户数据
  static getUser(walletAddress: string): MockUser | null {
    const user = mockData.users.find(u => u.wallet_address.toLowerCase() === walletAddress.toLowerCase())
    return user as MockUser || null
  }

  // 获取用户的资产
  static getUserAssets(walletAddress: string): MockAsset[] {
    const assets = mockData.assets.filter(a => a.creator_address.toLowerCase() === walletAddress.toLowerCase())
    return assets as MockAsset[]
  }

  // 获取用户统计信息
  static getUserStats(walletAddress: string) {
    const assets = this.getUserAssets(walletAddress)
    const user = this.getUser(walletAddress)

    if (!user) {
      return {
        totalAssets: 0,
        completedAssets: 0,
        processingAssets: 0,
        totalEarnings: 0
      }
    }

    const totalAssets = assets.length
    const completedAssets = assets.filter(a => a.status === 'registered').length
    const processingAssets = assets.filter(a => a.status === 'pending' || a.status === 'processing').length

    // 计算总收益
    const userEarnings = mockData.earnings.filter(e => e.user_id === user.id)
    const totalEarnings = userEarnings.reduce((sum, e) => sum + e.amount, 0)

    return {
      totalAssets,
      completedAssets,
      processingAssets,
      totalEarnings
    }
  }

  // 获取资产的许可证条款
  static getAssetLicenseTerms(assetId: string): MockLicenseTerms | null {
    const terms = mockData.licenseTerms.find(t => t.ip_asset_id === assetId)
    return terms as MockLicenseTerms || null
  }

  // 获取用户收益记录
  static getUserEarnings(walletAddress: string): MockEarning[] {
    const user = this.getUser(walletAddress)
    if (!user) return []

    const earnings = mockData.earnings.filter(e => e.user_id === user.id)
    return earnings as MockEarning[]
  }

  // 获取所有资产（用于主页展示）
  static getAllAssets(): MockAsset[] {
    return mockData.assets as MockAsset[]
  }

  // 获取最新资产
  static getLatestAssets(limit: number = 10): MockAsset[] {
    const assets = [...mockData.assets] as MockAsset[]
    return assets
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
  }

  // 按状态获取资产
  static getAssetsByStatus(status: string): MockAsset[] {
    return mockData.assets.filter(a => a.status === status) as MockAsset[]
  }

  // 获取热门资产（按评分排序）
  static getPopularAssets(limit: number = 10): MockAsset[] {
    const assets = [...mockData.assets] as MockAsset[]
    return assets
      .filter(a => a.content_score > 0)
      .sort((a, b) => b.content_score - a.content_score)
      .slice(0, limit)
  }

  // 获取全局统计
  static getGlobalStats() {
    const totalUsers = mockData.users.length
    const totalAssets = mockData.assets.length
    const registeredAssets = mockData.assets.filter(a => a.status === 'registered').length
    const totalEarnings = mockData.earnings.reduce((sum, e) => sum + e.amount, 0)
    const avgScore = mockData.assets.reduce((sum, a) => sum + a.content_score, 0) / totalAssets

    return {
      totalUsers,
      totalAssets,
      registeredAssets,
      totalEarnings,
      avgScore: Math.round(avgScore * 100) / 100,
      platformData: {
        tiktok: mockData.assets.filter(a => a.social_metrics?.platform === 'tiktok').length,
        xiaohongshu: mockData.assets.filter(a => a.social_metrics?.platform === 'xiaohongshu').length,
        instagram: mockData.assets.filter(a => a.social_metrics?.platform === 'instagram').length,
        weibo: mockData.assets.filter(a => a.social_metrics?.platform === 'weibo').length
      }
    }
  }

  // 搜索资产
  static searchAssets(query: string): MockAsset[] {
    const lowerQuery = query.toLowerCase()
    return mockData.assets.filter(a =>
      a.title.toLowerCase().includes(lowerQuery) ||
      a.description.toLowerCase().includes(lowerQuery) ||
      a.content_type.toLowerCase().includes(lowerQuery)
    ) as MockAsset[]
  }
}