import { NextRequest, NextResponse } from 'next/server'
import { SocialMetrics } from '@/types'

// 平台识别函数
function identifyPlatform(url: string): SocialMetrics['platform'] {
  const lowercaseUrl = url.toLowerCase()
  
  if (lowercaseUrl.includes('douyin.com') || lowercaseUrl.includes('tiktok.com')) {
    return 'tiktok'
  } else if (lowercaseUrl.includes('xiaohongshu.com') || lowercaseUrl.includes('xhs.com')) {
    return 'xiaohongshu'
  } else if (lowercaseUrl.includes('instagram.com')) {
    return 'instagram'
  } else {
    return 'other'
  }
}

// 抖音数据解析（模拟实现）
async function parseTikTokData(url: string): Promise<SocialMetrics> {
  // 在真实实现中，这里会调用抖音开放平台API
  // 目前返回模拟数据，但保持真实的数据结构
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 基于URL生成相对真实的模拟数据
  const urlHash = url.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const baseViews = Math.abs(urlHash) % 500000 + 10000
  
  return {
    followers: Math.floor(baseViews * 0.1) + Math.random() * 50000,
    views: baseViews,
    likes: Math.floor(baseViews * 0.08) + Math.random() * 5000,
    comments: Math.floor(baseViews * 0.005) + Math.random() * 500,
    shares: Math.floor(baseViews * 0.002) + Math.random() * 200,
    platform: 'tiktok'
  }
}

// 小红书数据解析（模拟实现）
async function parseXiaohongshuData(url: string): Promise<SocialMetrics> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const urlHash = url.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const baseViews = Math.abs(urlHash) % 300000 + 5000
  
  return {
    followers: Math.floor(baseViews * 0.15) + Math.random() * 30000,
    views: baseViews,
    likes: Math.floor(baseViews * 0.12) + Math.random() * 3000,
    comments: Math.floor(baseViews * 0.01) + Math.random() * 300,
    shares: Math.floor(baseViews * 0.005) + Math.random() * 150,
    platform: 'xiaohongshu'
  }
}

// Instagram数据解析（模拟实现）
async function parseInstagramData(url: string): Promise<SocialMetrics> {
  await new Promise(resolve => setTimeout(resolve, 1200))
  
  const urlHash = url.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const baseViews = Math.abs(urlHash) % 400000 + 8000
  
  return {
    followers: Math.floor(baseViews * 0.2) + Math.random() * 40000,
    views: baseViews,
    likes: Math.floor(baseViews * 0.1) + Math.random() * 4000,
    comments: Math.floor(baseViews * 0.008) + Math.random() * 400,
    shares: Math.floor(baseViews * 0.003) + Math.random() * 180,
    platform: 'instagram'
  }
}

// 通用数据解析
async function parseOtherPlatformData(url: string): Promise<SocialMetrics> {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const urlHash = url.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const baseViews = Math.abs(urlHash) % 200000 + 3000
  
  return {
    followers: Math.floor(baseViews * 0.08) + Math.random() * 20000,
    views: baseViews,
    likes: Math.floor(baseViews * 0.06) + Math.random() * 2000,
    comments: Math.floor(baseViews * 0.003) + Math.random() * 200,
    shares: Math.floor(baseViews * 0.001) + Math.random() * 100,
    platform: 'other'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { socialUrl } = await request.json()

    if (!socialUrl || typeof socialUrl !== 'string') {
      return NextResponse.json(
        { error: '无效的社交媒体链接' },
        { status: 400 }
      )
    }

    // URL格式验证
    try {
      new URL(socialUrl)
    } catch {
      return NextResponse.json(
        { error: '链接格式不正确' },
        { status: 400 }
      )
    }

    const platform = identifyPlatform(socialUrl)
    let metrics: SocialMetrics

    // 根据平台选择解析方法
    switch (platform) {
      case 'tiktok':
        metrics = await parseTikTokData(socialUrl)
        break
      case 'xiaohongshu':
        metrics = await parseXiaohongshuData(socialUrl)
        break
      case 'instagram':
        metrics = await parseInstagramData(socialUrl)
        break
      default:
        metrics = await parseOtherPlatformData(socialUrl)
    }

    // 添加解析时间戳
    const result = {
      ...metrics,
      parsedAt: new Date().toISOString(),
      sourceUrl: socialUrl
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('社交媒体数据解析错误:', error)
    return NextResponse.json(
      { error: '数据解析失败' },
      { status: 500 }
    )
  }
}

// GET方法：获取支持的平台列表
export async function GET() {
  return NextResponse.json({
    supportedPlatforms: [
      {
        name: '抖音',
        platform: 'tiktok',
        domains: ['douyin.com'],
        example: 'https://www.douyin.com/video/...'
      },
      {
        name: '小红书',
        platform: 'xiaohongshu',
        domains: ['xiaohongshu.com', 'xhs.com'],
        example: 'https://www.xiaohongshu.com/explore/...'
      },
      {
        name: 'Instagram',
        platform: 'instagram',
        domains: ['instagram.com'],
        example: 'https://www.instagram.com/p/...'
      }
    ]
  })
}