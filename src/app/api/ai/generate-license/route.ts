import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { LicenseTerms } from '@/types'

// OpenAI 客户端可能在构建时不可用
let openai: OpenAI | null = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.warn('OpenAI API Key not available during build');
}

// 默认保守的授权条款
function getDefaultLicenseTerms(): LicenseTerms {
  return {
    commercialUse: false,
    derivatives: false,
    attribution: true,
    shareAlike: true,
    territory: ['中国大陆'],
    channels: ['社交媒体'],
    timeframe: 12, // 1年
    royalty: 10
  }
}

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json()

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: '无效的请求参数' },
        { status: 400 }
      )
    }

    const prompt = `
    作为专业的版权授权顾问，请根据以下用户偏好生成标准的授权条款：
    
    用户回答：
    ${JSON.stringify(answers, null, 2)}
    
    请分析用户意图并返回JSON格式的授权条款，包含以下字段：
    - commercialUse: boolean (是否允许商业使用)
    - derivatives: boolean (是否允许二次创作)
    - attribution: boolean (是否需要署名)
    - shareAlike: boolean (是否要求相同方式共享)
    - territory: string[] (适用地区数组)
    - channels: string[] (允许使用渠道数组)
    - timeframe: number (授权期限，单位：月，0表示永久)
    - royalty: number (版税百分比，0-100)
    
    请确保返回有效的JSON格式。
    `

    try {
      // 运行时检查OpenAI客户端是否可用
      if (!openai) {
        if (process.env.OPENAI_API_KEY) {
          openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
          });
        } else {
          throw new Error('OpenAI API Key not configured');
        }
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的知识产权授权专家，擅长将用户需求转化为标准的授权条款。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('AI返回内容为空')
      }

      // 解析JSON响应
      const licenseTerms = JSON.parse(content) as LicenseTerms

      // 验证必要字段
      const requiredFields = ['commercialUse', 'derivatives', 'attribution', 'territory', 'channels', 'timeframe']
      for (const field of requiredFields) {
        if (licenseTerms[field as keyof LicenseTerms] === undefined) {
          throw new Error(`缺少必要字段: ${field}`)
        }
      }

      return NextResponse.json({ licenseTerms })

    } catch (aiError) {
      console.error('AI生成授权条款失败:', aiError)
      
      // 返回默认的保守授权条款
      return NextResponse.json({ 
        licenseTerms: getDefaultLicenseTerms(),
        fallback: true,
        message: '使用默认授权条款'
      })
    }

  } catch (error) {
    console.error('API路由错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}