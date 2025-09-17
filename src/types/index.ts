// 基础类型定义
export type Platform = 'tiktok' | 'xiaohongshu' | 'instagram' | 'weibo' | 'bilibili' | 'other'
export type ContentType = 'image' | 'video' | 'audio' | 'document' | 'social-link'
export type UploadStatus = 'pending' | 'uploading' | 'processing' | 'completed' | 'failed'
export type ChainId = 1 | 11155111 | 8453 | 84532 // Ethereum, Sepolia, Base, Base Sepolia

// 错误处理类型
export interface ApiError {
  code: string
  message: string
  details?: any
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
}

// 内容元数据类型定义
export interface ContentMetadata {
  title: string
  description?: string
  contentType: ContentType
  file?: File
  socialUrl?: string
  creator: string
  timestamp: number
  tags?: string[]
  category?: string
}

// 社交媒体指标
export interface SocialMetrics {
  followers: number
  views: number
  likes: number
  comments: number
  shares: number
  platform: Platform
  parsedAt?: string
  sourceUrl?: string
}

// 授权条款
export interface LicenseTerms {
  commercialUse: boolean
  derivatives: boolean
  attribution: boolean
  shareAlike: boolean
  territory: string[]
  channels: string[]
  timeframe: number // 授权期限（月），0表示永久
  royalty?: number // 版税百分比 0-100
}

// IPFS上传结果
export interface IPFSUploadResult {
  fileHash: string
  fileUrl: string
  metadataHash?: string
  metadataUrl?: string
  fileName: string
  fileSize: number
  fileType: string
}

// Story Protocol注册结果
export interface StoryProtocolResult {
  ipAssetId: string
  tokenId: string
  contractAddress: string
  txHash: string
  contentScore: number
  rewardAmount: number
  registeredAt: string
}

// IP资产（增强版）
export interface IPAsset {
  id: string
  tokenId?: number
  contractAddress?: string
  ipfsHash: string
  metadataHash?: string
  metadata: ContentMetadata
  licenseTerms: LicenseTerms
  socialMetrics?: SocialMetrics
  contentScore: number
  rewardAmount: number
  status: UploadStatus
  createdAt: number
  updatedAt: number
  txHash?: string
  chainId: ChainId
}

// AI问答接口
export interface AIQuestion {
  id: string
  question: string
  options?: string[]
  type: 'single' | 'multiple' | 'input'
  required?: boolean
  validation?: (value: any) => boolean | string
}

// 代币奖励等级
export interface RewardTier {
  grade: 'S' | 'A' | 'B' | 'C' | 'D'
  minScore: number
  maxScore: number
  tokenAmount: number
  description: string
  color: string
}

// 用户统计数据
export interface UserStats {
  totalAssets: number
  confirmedAssets: number
  totalEarnings: string // ETH format
  pendingAssets: number
  averageScore: number
}

// 内容卡片数据（首页展示用）
export interface ContentCardItem {
  id: number | string
  title: string
  creator: string
  type: string
  date: string
  status: '已确权' | '处理中' | '待审核'
  value: string
  gradient: string
  score?: number
  rewardAmount?: number
}