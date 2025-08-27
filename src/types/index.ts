// 内容元数据类型定义
export interface ContentMetadata {
  title: string;
  description?: string;
  contentType: 'image' | 'video' | 'social-link';
  file?: File;
  socialUrl?: string;
  creator: string;
  timestamp: number;
}

// 社交媒体指标
export interface SocialMetrics {
  followers: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  platform: 'tiktok' | 'xiaohongshu' | 'instagram' | 'other';
}

// 授权条款
export interface LicenseTerms {
  commercialUse: boolean;
  derivatives: boolean;
  attribution: boolean;
  shareAlike: boolean;
  territory: string[];
  channels: string[];
  timeframe: number; // 授权期限（月）
  royalty?: number; // 版税百分比
}

// IP资产
export interface IPAsset {
  id: string;
  tokenId?: number;
  contractAddress?: string;
  ipfsHash: string;
  metadata: ContentMetadata;
  licenseTerms: LicenseTerms;
  contentScore: number;
  createdAt: number;
}

// AI问答接口
export interface AIQuestion {
  id: string;
  question: string;
  options?: string[];
  type: 'single' | 'multiple' | 'input';
}

// 代币奖励等级
export interface RewardTier {
  minScore: number;
  maxScore: number;
  tokenAmount: number;
}