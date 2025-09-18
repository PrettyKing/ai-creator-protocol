import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database/services'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const creator = searchParams.get('creator')
    const search = searchParams.get('search')
    const popular = searchParams.get('popular')

    // 获取特定用户的资产
    if (creator) {
      const result = await DatabaseService.getUserIPAssets(creator)

      if (result.success) {
        // 获取用户统计信息
        const statsResult = await DatabaseService.getUserStats(creator)

        return NextResponse.json({
          success: true,
          data: {
            assets: result.data,
            stats: statsResult.data
          }
        })
      } else {
        return NextResponse.json(
          { success: false, error: '获取用户资产失败', details: result.error },
          { status: 500 }
        )
      }
    }

    // 搜索资产
    if (search) {
      const result = await DatabaseService.searchIPAssets(search)

      if (result.success) {
        return NextResponse.json({
          success: true,
          data: result.data
        })
      } else {
        return NextResponse.json(
          { success: false, error: '搜索资产失败', details: result.error },
          { status: 500 }
        )
      }
    }

    // 获取热门资产
    if (popular) {
      const result = await DatabaseService.getPopularIPAssets()

      if (result.success) {
        return NextResponse.json({
          success: true,
          data: result.data
        })
      } else {
        return NextResponse.json(
          { success: false, error: '获取热门资产失败', details: result.error },
          { status: 500 }
        )
      }
    }

    // 默认返回空结果
    return NextResponse.json({
      success: true,
      data: []
    })

  } catch (error) {
    console.error('Assets API错误:', error)
    return NextResponse.json(
      { success: false, error: '服务器内部错误', details: error },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      creatorAddress,
      contentType,
      contentHash,
      metadataHash,
      socialUrl,
      socialMetrics,
      contentScore,
      grade
    } = body

    // 验证必需字段
    if (!title || !creatorAddress) {
      return NextResponse.json(
        { success: false, error: '缺少必需字段: title, creatorAddress' },
        { status: 400 }
      )
    }

    const result = await DatabaseService.createIPAsset({
      title,
      description,
      creatorAddress,
      contentType,
      contentHash,
      metadataHash,
      socialUrl,
      socialMetrics,
      contentScore,
      grade
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data
      })
    } else {
      return NextResponse.json(
        { success: false, error: '创建IP资产失败', details: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('创建Assets API错误:', error)
    return NextResponse.json(
      { success: false, error: '服务器内部错误', details: error },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少必需字段: id' },
        { status: 400 }
      )
    }

    const result = await DatabaseService.updateIPAsset(id, updates)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data
      })
    } else {
      return NextResponse.json(
        { success: false, error: '更新IP资产失败', details: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('更新Assets API错误:', error)
    return NextResponse.json(
      { success: false, error: '服务器内部错误', details: error },
      { status: 500 }
    )
  }
}