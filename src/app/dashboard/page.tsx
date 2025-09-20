'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Database,
  Activity,
  TrendingUp,
  Cpu,
  Eye,
  Wallet,
  ArrowUpRight,
  Copy,
  ExternalLink,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { PageLayout } from '@/components/common'
import { useUser, useAssets, useSocialIntegrations } from '@/hooks/useDatabase'
import { DatabaseService } from '@/lib/database/services'
import { MockDataService } from '@/lib/mock-data-service'

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { user, loading: userLoading } = useUser()
  const {
    assets: dbAssets,
    loading: assetsLoading,
    refetch: refetchAssets
  } = useAssets(user?.id)
  const { integrations } = useSocialIntegrations(user?.id)

  const [stats, setStats] = useState({
    totalAssets: 0,
    completedAssets: 0,
    totalEarnings: 0,
    processingAssets: 0
  })
  const [realAssets, setRealAssets] = useState<any[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isCreatingTestData, setIsCreatingTestData] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // 从API加载真实数据
  const loadRealData = async () => {
    if (!address) return

    setIsLoadingData(true)
    try {
      // 首先尝试从API加载
      const response = await fetch(`/api/users/${address}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setStats(result.data.stats)
          setRealAssets(result.data.assets)
          return
        }
      }

      // 如果API失败，从模拟数据加载
      console.log('从模拟数据加载数据...')
      const mockStats = MockDataService.getUserStats(address)
      const mockAssets = MockDataService.getUserAssets(address)

      setStats(mockStats)
      setRealAssets(mockAssets)

    } catch (error) {
      console.error('加载数据失败:', error)

      // 最后备用：加载模拟数据
      try {
        const mockStats = MockDataService.getUserStats(address)
        const mockAssets = MockDataService.getUserAssets(address)
        setStats(mockStats)
        setRealAssets(mockAssets)
      } catch (mockError) {
        console.error('加载模拟数据也失败:', mockError)
      }
    } finally {
      setIsLoadingData(false)
    }
  }

  // 创建测试数据
  const createTestData = async () => {
    if (!address) return

    setIsCreatingTestData(true)
    try {
      const response = await fetch('/api/test-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // 创建成功后自动刷新数据
          await loadRealData()
          refetchAssets()
          setSuccessMessage(`成功创建 ${result.data.createdCount} 个测试资产！`)
          setTimeout(() => setSuccessMessage(''), 3000)
        }
      }
    } catch (error) {
      console.error('创建测试数据失败:', error)
    } finally {
      setIsCreatingTestData(false)
    }
  }

  // 当钱包地址变化时加载数据
  useEffect(() => {
    if (address) {
      loadRealData()
    }
  }, [address])

  // 原有的模拟数据计算（作为备用）
  useEffect(() => {
    if (dbAssets && realAssets.length === 0) {
      const totalAssets = dbAssets.length
      const completedAssets = dbAssets.filter(asset => asset.status === 'registered').length
      const processingAssets = dbAssets.filter(asset => asset.status === 'pending').length
      const totalEarnings = dbAssets.reduce((sum, asset) => {
        // 如果有 license_terms，尝试从中获取收益信息
        const earnings = asset.license_terms?.earnings || 0
        return sum + Number(earnings)
      }, 0)

      setStats({
        totalAssets,
        completedAssets,
        totalEarnings,
        processingAssets
      })
    }
  }, [dbAssets])

  const loading = userLoading || assetsLoading

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // 可以添加toast提示
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'registered':
        return <Badge className="bg-green-100 text-green-800">已确权</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">处理中</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">失败</Badge>
      default:
        return <Badge>未知</Badge>
    }
  }

  if (!isConnected) {
    return (
      <PageLayout
        variant="cyberpunk"
        headerVariant="main"
        headerTitle="用户仪表板"
        headerSubtitle="Asset Dashboard"
        showBackButton
        backHref="/"
        backText="返回首页"
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm border-blue-500/20">
            <CardContent className="text-center py-12">
              <Wallet className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">请先连接钱包</h3>
              <p className="text-blue-200/80 mb-6">
                连接您的Web3钱包以查看和管理您的数字资产
              </p>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      variant="cyberpunk"
      headerVariant="main"
      headerTitle="用户仪表板"
      headerSubtitle="Asset Dashboard"
      showBackButton
      backHref="/"
      backText="返回首页"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 成功消息 */}
        {successMessage && (
          <div className="bg-green-800/30 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-300 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* 用户信息 */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">我的钱包</h2>
                <div className="flex items-center space-x-2 text-blue-200/80">
                  <span className="font-mono text-sm">{address?.slice(0, 8)}...{address?.slice(-6)}</span>
                  <button
                    onClick={() => copyToClipboard(address || '')}
                    className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  refetchAssets()
                  loadRealData()
                }}
                disabled={isLoadingData || assetsLoading}
                className="bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 hover:text-white border-blue-500/30"
              >
                {(isLoadingData || assetsLoading) ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                刷新数据
              </Button>

              <Button
                variant="outline"
                onClick={createTestData}
                disabled={isCreatingTestData}
                className="bg-green-700/50 hover:bg-green-600/50 text-green-300 hover:text-white border-green-500/30"
              >
                {isCreatingTestData ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Database className="w-4 h-4 mr-2" />
                )}
                创建测试数据
              </Button>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/30 backdrop-blur-sm border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200/70 text-sm font-medium">总资产</p>
                  <p className="text-2xl font-bold text-white">{stats.totalAssets}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 backdrop-blur-sm border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200/70 text-sm font-medium">已确权</p>
                  <p className="text-2xl font-bold text-white">{stats.completedAssets}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 backdrop-blur-sm border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200/70 text-sm font-medium">总收益</p>
                  <p className="text-2xl font-bold text-white">${stats.totalEarnings.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 backdrop-blur-sm border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200/70 text-sm font-medium">处理中</p>
                  <p className="text-2xl font-bold text-white">{stats.processingAssets}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 资产列表 */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-blue-500/20 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-500/20">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">我的数字资产</h3>
              <Link href="/upload">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                  上传新资产
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-spin" />
                <p className="text-blue-200/80">加载资产数据中...</p>
              </div>
            ) : !dbAssets || dbAssets.length === 0 ? (
              <div className="text-center py-12">
                <Database className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                <h4 className="text-lg font-semibold text-white mb-2">暂无数字资产</h4>
                <p className="text-blue-200/80 mb-6">
                  开始上传您的第一个数字资产，将创意转化为可编程的价值
                </p>
                <Link href="/upload">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                    立即上传
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {dbAssets.map((asset) => (
                  <Card key={asset.id} className="bg-slate-700/30 backdrop-blur-sm border-slate-600/50 hover:border-blue-500/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-white">{asset.name}</h4>
                            {getStatusBadge(asset.status)}
                          </div>
                          <p className="text-blue-200/70 text-sm mb-4">{asset.description || '暂无描述'}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-blue-200/50">文件类型</p>
                              <p className="text-sm font-medium text-white">{asset.ipfs_hash ? 'IPFS' : '本地'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-blue-200/50">IPFS Hash</p>
                              <p className="text-sm font-medium text-white truncate">{asset.ipfs_hash?.slice(0, 8)}...</p>
                            </div>
                            {asset.license_terms?.views !== undefined && (
                              <div>
                                <p className="text-xs text-blue-200/50">浏览量</p>
                                <p className="text-sm font-medium text-white">{asset.license_terms.views.toLocaleString()}</p>
                              </div>
                            )}
                            {asset.license_terms?.earnings !== undefined && (
                              <div>
                                <p className="text-xs text-blue-200/50">收益</p>
                                <p className="text-sm font-medium text-white">${asset.license_terms.earnings.toFixed(2)}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-4 text-xs text-blue-200/70">
                            <span>创建时间: {formatDate(asset.created_at)}</span>
                            {(asset as any).ip_asset_id && <span>IP ID: {(asset as any).ip_asset_id}</span>}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          {asset.ipfs_hash && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(asset.ipfs_hash)}
                              className="bg-slate-600/50 hover:bg-slate-500/50 text-blue-300 border-blue-500/30"
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              复制Hash
                            </Button>
                          )}
                          {asset.file_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="bg-slate-600/50 hover:bg-slate-500/50 text-blue-300 border-blue-500/30"
                            >
                              <a href={asset.file_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                查看
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}