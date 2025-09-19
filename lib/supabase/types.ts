// 简化的Supabase类型定义
export interface User {
  id: string
  wallet_address: string
  created_at: string
  updated_at: string
}

export interface IPAsset {
  id: string
  user_id: string
  name: string
  description: string | null
  file_url: string
  ipfs_hash: string
  ip_id: string | null
  license_terms: any
  status: 'pending' | 'registered' | 'failed'
  created_at: string
  updated_at: string
}

export interface SocialIntegration {
  id: string
  user_id: string
  platform: 'tiktok' | 'instagram' | 'xiaohongshu' | 'youtube'
  account_id: string
  account_name: string
  metrics: any
  connected_at: string
  updated_at: string
}

export interface License {
  id: string
  asset_id: string
  licensee_id: string | null
  license_type: string
  terms: any
  price: number | null
  royalty_percentage: number | null
  transaction_hash: string | null
  expires_at: string | null
  created_at: string
}