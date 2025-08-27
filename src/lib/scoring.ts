import { SocialMetrics } from '@/types';

export class ContentScorer {
  // 内容评分算法
  static calculateScore(metrics: SocialMetrics): number {
    // 权重配置
    const weights = {
      followers: 0.25,
      views: 0.30,
      likes: 0.20,
      comments: 0.15,
      shares: 0.10
    };
    
    // 平台基础权重
    const platformWeight = this.getPlatformWeight(metrics.platform);
    
    // 对数归一化处理，避免数值过大
    const normalizedMetrics = {
      followers: Math.log10(Math.max(metrics.followers, 1)),
      views: Math.log10(Math.max(metrics.views, 1)),
      likes: Math.log10(Math.max(metrics.likes, 1)),
      comments: Math.log10(Math.max(metrics.comments, 1)),
      shares: Math.log10(Math.max(metrics.shares, 1))
    };
    
    // 计算加权分数
    const rawScore = 
      (normalizedMetrics.followers * weights.followers) +
      (normalizedMetrics.views * weights.views) +
      (normalizedMetrics.likes * weights.likes) +
      (normalizedMetrics.comments * weights.comments) +
      (normalizedMetrics.shares * weights.shares);
    
    // 应用平台权重并映射到0-100范围
    const score = rawScore * platformWeight * 10;
    
    // 确保分数在0-100范围内
    return Math.min(100, Math.max(0, Math.round(score)));
  }
  
  // 获取平台权重
  private static getPlatformWeight(platform: SocialMetrics['platform']): number {
    const platformWeights = {
      tiktok: 1.2,        // 抖音传播力强
      xiaohongshu: 1.1,   // 小红书质量较高
      instagram: 1.0,     // Instagram标准权重
      other: 0.9          // 其他平台略低
    };
    
    return platformWeights[platform];
  }
  
  // 根据分数获取奖励代币数量
  static getRewardAmount(score: number): number {
    if (score >= 80) return 250;
    if (score >= 60) return 100;
    if (score >= 40) return 50;
    if (score >= 20) return 10;
    return 0;
  }
  
  // 获取分数等级描述
  static getScoreGrade(score: number): { grade: string; color: string; description: string } {
    if (score >= 80) {
      return {
        grade: 'S',
        color: 'text-yellow-600',
        description: '爆款内容'
      };
    }
    if (score >= 60) {
      return {
        grade: 'A',
        color: 'text-green-600',
        description: '优质内容'
      };
    }
    if (score >= 40) {
      return {
        grade: 'B',
        color: 'text-blue-600',
        description: '良好内容'
      };
    }
    if (score >= 20) {
      return {
        grade: 'C',
        color: 'text-orange-600',
        description: '普通内容'
      };
    }
    return {
      grade: 'D',
      color: 'text-gray-600',
      description: '待提升'
    };
  }
}