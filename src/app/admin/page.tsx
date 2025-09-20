'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Database, RefreshCw, Trash2, CheckCircle, AlertCircle, Info } from 'lucide-react'

export default function AdminPage() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [initResult, setInitResult] = useState<any>(null)

  const initializeData = async () => {
    setIsInitializing(true)
    setInitResult(null)

    try {
      const response = await fetch('/api/init-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      setInitResult(result)

      if (result.success) {
        console.log('✅ 数据初始化成功:', result)
      } else {
        console.error('❌ 数据初始化失败:', result)
      }
    } catch (error) {
      console.error('数据初始化请求失败:', error)
      setInitResult({
        success: false,
        error: '请求失败',
        details: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">系统管理</h1>
          <p className="text-blue-200/80">管理系统数据和配置</p>
        </div>

        {/* 数据初始化卡片 */}
        <Card className="bg-slate-800/30 backdrop-blur-sm border-blue-500/20 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Database className="w-5 h-5 text-blue-400" />
              <span>数据初始化</span>
            </CardTitle>
            <CardDescription className="text-blue-200/70">
              初始化测试数据，包括用户、IP资产、许可证条款和收益记录
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-700/30 p-4 rounded-lg border border-blue-500/10">
                <h4 className="font-medium text-white mb-2">将创建的数据：</h4>
                <ul className="text-sm text-blue-200/80 space-y-1">
                  <li>• 5个测试钱包地址的用户数据</li>
                  <li>• 每个用户2-5个不同类型的IP资产（图片、视频、音频、文本、代码）</li>
                  <li>• 每个资产的许可证条款配置</li>
                  <li>• 已确权资产的收益记录</li>
                  <li>• 随机的社交媒体数据（抖音、小红书、Instagram等）</li>
                </ul>
              </div>

              <Button
                onClick={initializeData}
                disabled={isInitializing}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                {isInitializing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    初始化中...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    开始初始化数据
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 结果显示 */}
        {initResult && (
          <Card className={`bg-slate-800/30 backdrop-blur-sm border-${initResult.success ? 'green' : 'red'}-500/20`}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                {initResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <span>{initResult.success ? '初始化成功' : '初始化失败'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {initResult.success ? (
                  <div>
                    <div className="bg-green-900/20 border border-green-500/20 p-4 rounded-lg mb-4">
                      <p className="text-green-300 font-medium mb-2">{initResult.data.summary}</p>
                      <div className="text-sm text-green-200/80">
                        <p>时间: {new Date(initResult.data.timestamp).toLocaleString('zh-CN')}</p>
                      </div>
                    </div>

                    {initResult.data.details && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-900/20 border border-blue-500/20 p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-400">{initResult.data.details.users}</div>
                          <div className="text-xs text-blue-200/70">用户</div>
                        </div>
                        <div className="bg-purple-900/20 border border-purple-500/20 p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-purple-400">{initResult.data.details.assets}</div>
                          <div className="text-xs text-purple-200/70">资产</div>
                        </div>
                        <div className="bg-green-900/20 border border-green-500/20 p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-400">{initResult.data.details.licenses}</div>
                          <div className="text-xs text-green-200/70">许可证</div>
                        </div>
                        <div className="bg-yellow-900/20 border border-yellow-500/20 p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-yellow-400">{initResult.data.details.earnings}</div>
                          <div className="text-xs text-yellow-200/70">收益记录</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-900/20 border border-red-500/20 p-4 rounded-lg">
                    <p className="text-red-300 font-medium mb-2">错误信息:</p>
                    <p className="text-red-200/80 text-sm">{initResult.error}</p>
                    {initResult.details && (
                      <p className="text-red-200/60 text-xs mt-2">{initResult.details}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 系统信息 */}
        <Card className="bg-slate-800/30 backdrop-blur-sm border-blue-500/20 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Info className="w-5 h-5 text-blue-400" />
              <span>系统信息</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-200/70 mb-1">数据库状态:</p>
                <Badge className={`${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Supabase 已配置' : '使用模拟数据'}
                </Badge>
              </div>
              <div>
                <p className="text-blue-200/70 mb-1">环境:</p>
                <Badge className="bg-blue-100 text-blue-800">
                  {process.env.NODE_ENV === 'development' ? '开发环境' : '生产环境'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 快速导航 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/30 backdrop-blur-sm border-blue-500/20 hover:border-blue-400/40 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <Database className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="font-medium text-white mb-1">数据概览</h3>
              <p className="text-xs text-blue-200/70">查看系统数据统计</p>
            </CardContent>
          </Card>

          <a href="/dashboard" className="block">
            <Card className="bg-slate-800/30 backdrop-blur-sm border-green-500/20 hover:border-green-400/40 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-medium text-white mb-1">用户仪表板</h3>
                <p className="text-xs text-green-200/70">查看用户数据和资产</p>
              </CardContent>
            </Card>
          </a>

          <a href="/test-styles" className="block">
            <Card className="bg-slate-800/30 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/40 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <RefreshCw className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="font-medium text-white mb-1">样式测试</h3>
                <p className="text-xs text-purple-200/70">验证页面样式和布局</p>
              </CardContent>
            </Card>
          </a>
        </div>
      </div>
    </div>
  )
}