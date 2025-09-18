import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// 检查是否配置了真实的Supabase URL
const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseUrl.includes('supabase.co')

// 创建Supabase客户端
export const supabase = isSupabaseConfigured ?
  createClient<Database>(supabaseUrl, supabaseAnonKey) :
  null

// 服务端客户端 (使用service key)
export const supabaseAdmin = isSupabaseConfigured ?
  createClient<Database>(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
  ) : null

// 检查Supabase连接
export const checkSupabaseConnection = async () => {
  try {
    if (!supabase) {
      return { connected: false, error: 'Supabase未配置' }
    }

    const { data, error } = await supabase.from('users').select('count').limit(1).single()
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error
    }
    return { connected: true, error: null }
  } catch (error) {
    console.error('Supabase连接失败:', error)
    return { connected: false, error }
  }
}

// 实用函数：获取用户或创建用户
export const getOrCreateUser = async (walletAddress: string) => {
  try {
    if (!supabase) {
      console.warn('Supabase未配置，返回模拟用户数据')
      return {
        user: {
          id: 'mock-user-id',
          wallet_address: walletAddress,
          username: null,
          email: null,
          avatar_url: null,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        },
        error: null
      }
    }

    // 首先尝试获取现有用户
    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    if (error && error.code === 'PGRST116') {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          wallet_address: walletAddress,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        })
        .select('*')
        .single()

      if (createError) {
        throw createError
      }

      user = newUser
    } else if (error) {
      throw error
    } else {
      // 用户存在，更新最后登录时间
      if (user?.id) {
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id)
      }
    }

    return { user, error: null }
  } catch (error) {
    console.error('获取/创建用户失败:', error)
    return { user: null, error }
  }
}