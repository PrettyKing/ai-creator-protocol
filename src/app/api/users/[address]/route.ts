import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database/services'

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address

    if (!address) {
      return NextResponse.json(
        { error: '缺少钱包地址' },
        { status: 400 }
      )
    }

    // 验证钱包地址格式
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: '无效的钱包地址格式' },
        { status: 400 }
      )
    }

    // 获取用户统计数据
    const statsResult = await DatabaseService.getUserStats(address)

    // 获取用户IP资产
    const assetsResult = await DatabaseService.getUserIPAssets(address)

    return NextResponse.json({
      success: true,
      data: {
        stats: statsResult.success ? statsResult.data : {
          totalAssets: 0,
          completedAssets: 0,
          processingAssets: 0,
          totalEarnings: 0
        },
        assets: assetsResult.success ? assetsResult.data : [],
        hasSupabaseConfig: !!process.env.NEXT_PUBLIC_SUPABASE_URL
      }
    })

  } catch (error) {
    console.error('获取用户数据错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// 更新用户信息
export async function PATCH(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address
    const body = await request.json()
    const { username, email, avatar_url } = body

    if (!address) {
      return NextResponse.json(
        { error: '缺少钱包地址' },
        { status: 400 }
      )
    }

    // 验证钱包地址格式
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: '无效的钱包地址格式' },
        { status: 400 }
      )
    }

    // TODO: 实现用户信息更新逻辑
    // 当前只返回成功响应，实际更新逻辑可以后续添加

    return NextResponse.json({
      success: true,
      message: '用户信息更新成功'
    })

  } catch (error) {
    console.error('更新用户信息错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}