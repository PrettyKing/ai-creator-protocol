import { supabase, getOrCreateUser } from '@/lib/supabase'
import { Database } from '@/types/database'
import { LicenseTerms, SocialMetrics } from '@/types'

type IPAsset = Database['public']['Tables']['ip_assets']['Row']
type IPAssetInsert = Database['public']['Tables']['ip_assets']['Insert']
type IPAssetUpdate = Database['public']['Tables']['ip_assets']['Update']
type LicenseTermsInsert = Database['public']['Tables']['license_terms']['Insert']
type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
type EarningsInsert = Database['public']['Tables']['earnings']['Insert']

export class DatabaseService {
  // 创建IP资产
  static async createIPAsset(data: {
    title: string
    description?: string
    creatorAddress: string
    contentType?: string
    contentHash?: string
    metadataHash?: string
    socialUrl?: string
    socialMetrics?: SocialMetrics
    contentScore?: number
    grade?: string
  }) {
    try {
      if (!supabase) {
        console.warn('Supabase未配置，返回模拟数据')
        return {
          success: true,
          data: {
            id: 'mock-asset-' + Date.now(),
            title: data.title,
            description: data.description || '',
            creator_address: data.creatorAddress,
            status: 'processing',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          error: null
        }
      }

      const { user } = await getOrCreateUser(data.creatorAddress)

      const insertData: IPAssetInsert = {
        title: data.title,
        description: data.description || null,
        creator_id: user?.id || null,
        creator_address: data.creatorAddress,
        content_type: data.contentType || null,
        content_hash: data.contentHash || null,
        metadata_hash: data.metadataHash || null,
        social_url: data.socialUrl || null,
        social_metrics: data.socialMetrics ? JSON.parse(JSON.stringify(data.socialMetrics)) : null,
        content_score: data.contentScore || null,
        grade: data.grade || null,
        status: 'processing',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data: ipAsset, error } = await supabase
        .from('ip_assets')
        .insert(insertData)
        .select('*')
        .single()

      if (error) throw error

      return { success: true, data: ipAsset, error: null }
    } catch (error) {
      console.error('创建IP资产失败:', error)
      return { success: false, data: null, error }
    }
  }

  // 更新IP资产状态
  static async updateIPAsset(id: string, updates: IPAssetUpdate) {
    if (!supabase) {
      console.warn('Supabase未配置，跳过数据库更新')
      return { success: false, data: null, error: 'Supabase未配置' }
    }

    try {
      const updateData: IPAssetUpdate = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { data: ipAsset, error } = await supabase
        .from('ip_assets')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single()

      if (error) throw error

      return { success: true, data: ipAsset, error: null }
    } catch (error) {
      console.error('更新IP资产失败:', error)
      return { success: false, data: null, error }
    }
  }

  // 获取用户的所有IP资产
  static async getUserIPAssets(creatorAddress: string) {
    if (!supabase) {
      console.warn('Supabase未配置，返回空数组')
      return { success: true, data: [], error: null }
    }

    try {
      const { data: assets, error } = await supabase
        .from('ip_assets')
        .select(`
          *,
          license_terms (*),
          transactions (*)
        `)
        .eq('creator_address', creatorAddress)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { success: true, data: assets, error: null }
    } catch (error) {
      console.error('获取用户IP资产失败:', error)
      return { success: false, data: [], error }
    }
  }

  // 创建授权条款
  static async createLicenseTerms(ipAssetId: string, licenseTerms: LicenseTerms) {
    if (!supabase) {
      console.warn('Supabase未配置，跳过授权条款创建')
      return { success: false, data: null, error: 'Supabase未配置' }
    }

    try {
      const insertData: LicenseTermsInsert = {
        ip_asset_id: ipAssetId,
        commercial_use: licenseTerms.commercialUse || false,
        derivatives: licenseTerms.derivatives || false,
        attribution: licenseTerms.attribution || true,
        share_alike: licenseTerms.shareAlike || false,
        territory: licenseTerms.territory || [],
        channels: licenseTerms.channels || [],
        timeframe: licenseTerms.timeframe || null,
        royalty: licenseTerms.royalty || null,
        created_at: new Date().toISOString()
      }

      const { data: terms, error } = await supabase
        .from('license_terms')
        .insert(insertData)
        .select('*')
        .single()

      if (error) throw error

      return { success: true, data: terms, error: null }
    } catch (error) {
      console.error('创建授权条款失败:', error)
      return { success: false, data: null, error }
    }
  }

  // 记录交易
  static async recordTransaction(data: {
    ipAssetId?: string
    fromAddress?: string
    toAddress?: string
    txHash: string
    txType?: string
    amount?: number
    gasUsed?: number
    gasPrice?: number
    blockNumber?: number
    status?: string
  }) {
    if (!supabase) {
      console.warn('Supabase未配置，跳过交易记录')
      return { success: false, data: null, error: 'Supabase未配置' }
    }

    try {
      const insertData: TransactionInsert = {
        ip_asset_id: data.ipAssetId || null,
        from_address: data.fromAddress || null,
        to_address: data.toAddress || null,
        tx_hash: data.txHash,
        tx_type: data.txType || null,
        amount: data.amount || null,
        gas_used: data.gasUsed || null,
        gas_price: data.gasPrice || null,
        block_number: data.blockNumber || null,
        status: data.status || 'pending',
        created_at: new Date().toISOString()
      }

      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert(insertData)
        .select('*')
        .single()

      if (error) throw error

      return { success: true, data: transaction, error: null }
    } catch (error) {
      console.error('记录交易失败:', error)
      return { success: false, data: null, error }
    }
  }

  // 记录收益
  static async recordEarnings(data: {
    userAddress: string
    ipAssetId?: string
    amount: number
    tokenSymbol?: string
    source?: string
    txHash?: string
  }) {
    if (!supabase) {
      console.warn('Supabase未配置，跳过收益记录')
      return { success: false, data: null, error: 'Supabase未配置' }
    }

    try {
      const { user } = await getOrCreateUser(data.userAddress)
      if (!user) throw new Error('用户不存在')

      const insertData: EarningsInsert = {
        user_id: user.id,
        ip_asset_id: data.ipAssetId || null,
        amount: data.amount,
        token_symbol: data.tokenSymbol || 'ETH',
        source: data.source || null,
        tx_hash: data.txHash || null,
        created_at: new Date().toISOString()
      }

      const { data: earnings, error } = await supabase
        .from('earnings')
        .insert(insertData)
        .select('*')
        .single()

      if (error) throw error

      return { success: true, data: earnings, error: null }
    } catch (error) {
      console.error('记录收益失败:', error)
      return { success: false, data: null, error }
    }
  }

  // 获取用户统计信息
  static async getUserStats(creatorAddress: string) {
    if (!supabase) {
      console.warn('Supabase未配置，返回默认统计数据')
      return {
        success: true,
        data: {
          totalAssets: 0,
          completedAssets: 0,
          processingAssets: 0,
          totalEarnings: 0
        },
        error: null
      }
    }

    try {
      const { data: assetsCount, error: assetsError } = await supabase
        .from('ip_assets')
        .select('status')
        .eq('creator_address', creatorAddress)

      if (assetsError) throw assetsError

      const { user } = await getOrCreateUser(creatorAddress)
      const { data: earnings, error: earningsError } = await supabase
        .from('earnings')
        .select('amount, token_symbol')
        .eq('user_id', user?.id || '')

      if (earningsError) throw earningsError

      const totalAssets = assetsCount?.length || 0
      const completedAssets = assetsCount?.filter(asset => asset.status === 'completed').length || 0
      const processingAssets = assetsCount?.filter(asset => asset.status === 'processing').length || 0
      const totalEarnings = earnings?.reduce((sum, earning) => sum + earning.amount, 0) || 0

      return {
        success: true,
        data: {
          totalAssets,
          completedAssets,
          processingAssets,
          totalEarnings
        },
        error: null
      }
    } catch (error) {
      console.error('获取用户统计失败:', error)
      return {
        success: false,
        data: {
          totalAssets: 0,
          completedAssets: 0,
          processingAssets: 0,
          totalEarnings: 0
        },
        error
      }
    }
  }

  // 搜索IP资产 (简化版本，Supabase未配置时返回空数组)
  static async searchIPAssets(query: string, limit = 20) {
    if (!supabase) {
      return { success: true, data: [], error: null }
    }

    try {
      const { data: assets, error } = await supabase
        .from('ip_assets')
        .select(`
          *,
          license_terms (*)
        `)
        .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
        .eq('status', 'completed')
        .limit(limit)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { success: true, data: assets || [], error: null }
    } catch (error) {
      console.error('搜索IP资产失败:', error)
      return { success: false, data: [], error }
    }
  }

  // 获取热门IP资产
  static async getPopularIPAssets(limit = 20) {
    if (!supabase) {
      return { success: true, data: [], error: null }
    }

    try {
      const { data: assets, error } = await supabase
        .from('ip_assets')
        .select(`
          *,
          license_terms (*)
        `)
        .eq('status', 'completed')
        .not('content_score', 'is', null)
        .order('content_score', { ascending: false })
        .limit(limit)

      if (error) throw error

      return { success: true, data: assets || [], error: null }
    } catch (error) {
      console.error('获取热门IP资产失败:', error)
      return { success: false, data: [], error }
    }
  }
}