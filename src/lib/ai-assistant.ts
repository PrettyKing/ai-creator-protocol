import { AIQuestion, LicenseTerms } from '@/types';

export class LicenseAI {
  // 移除客户端OpenAI实例，改用API路由
  
  // AI问答流程
  static getQuestions(): AIQuestion[] {
    return [
      {
        id: 'content_type',
        question: '你的内容主要类型是什么？',
        options: ['原创摄影', '设计作品', '视频内容', '文字创作', '其他'],
        type: 'single'
      },
      {
        id: 'commercial_use',
        question: '是否允许他人将你的作品用于商业用途？',
        options: ['允许', '不允许', '需要付费授权'],
        type: 'single'
      },
      {
        id: 'derivatives',
        question: '是否允许他人基于你的作品进行二次创作？',
        options: ['允许', '不允许', '仅允许非商业用途'],
        type: 'single'
      },
      {
        id: 'attribution',
        question: '使用你的作品时是否需要署名？',
        options: ['必须署名', '建议署名', '不需要署名'],
        type: 'single'
      },
      {
        id: 'territory',
        question: '授权适用的地区范围？',
        options: ['全球', '中国大陆', '亚洲', '自定义'],
        type: 'multiple'
      },
      {
        id: 'channels',
        question: '允许在哪些渠道使用？',
        options: ['社交媒体', '网站博客', '印刷媒体', '广告营销', '电商平台'],
        type: 'multiple'
      },
      {
        id: 'timeframe',
        question: '授权期限多长？',
        options: ['1年', '3年', '5年', '永久', '自定义'],
        type: 'single'
      }
    ];
  }
  
  // 根据用户回答生成授权条款
  async generateLicenseTerms(answers: Record<string, any>): Promise<LicenseTerms> {
    try {
      const response = await fetch('/api/ai/generate-license', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data.licenseTerms;
      
    } catch (error) {
      console.error('AI生成授权条款失败:', error);
      
      // 返回默认的保守授权条款
      return this.getDefaultLicenseTerms();
    }
  }
  
  // 默认保守的授权条款
  private getDefaultLicenseTerms(): LicenseTerms {
    return {
      commercialUse: false,
      derivatives: false,
      attribution: true,
      shareAlike: true,
      territory: ['中国大陆'],
      channels: ['社交媒体'],
      timeframe: 12, // 1年
      royalty: 10
    };
  }
  
  // 生成人类可读的授权条款描述
  static generateLicenseDescription(terms: LicenseTerms): string {
    const parts = [];
    
    if (terms.commercialUse) {
      parts.push('✅ 允许商业使用');
    } else {
      parts.push('❌ 禁止商业使用');
    }
    
    if (terms.derivatives) {
      parts.push('✅ 允许二次创作');
    } else {
      parts.push('❌ 禁止二次创作');
    }
    
    if (terms.attribution) {
      parts.push('📝 需要署名');
    }
    
    if (terms.territory.length > 0) {
      parts.push(`🌍 授权地区: ${terms.territory.join(', ')}`);
    }
    
    if (terms.channels.length > 0) {
      parts.push(`📺 使用渠道: ${terms.channels.join(', ')}`);
    }
    
    if (terms.timeframe > 0) {
      parts.push(`⏰ 授权期限: ${terms.timeframe}个月`);
    } else {
      parts.push('⏰ 永久授权');
    }
    
    if (terms.royalty && terms.royalty > 0) {
      parts.push(`💰 版税: ${terms.royalty}%`);
    }
    
    return parts.join('\n');
  }
}