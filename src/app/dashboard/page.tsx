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

interface IPAsset {
  id: string
  title: string
  description: string
  contentType: string
  status: 'completed' | 'processing' | 'failed'
  createdAt: string
  txHash: string
  ipAssetId: string
  contractAddress: string
  contentScore: number
  rewardAmount: number
  views?: number
  earnings?: number
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const [assets, setAssets] = useState<IPAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalAssets: 0,
    completedAssets: 0,
    totalEarnings: 0,
    processingAssets: 0
  })

  // 模拟用户资产数据
  useEffect(() => {
    if (isConnected && address) {
      loadUserAssets()
    }
  }, [isConnected, address]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserAssets = async () => {
    setLoading(true)
    try {
      // 调用真实API获取用户资产
      const response = await fetch(`/api/assets?creator=${address}`)
      const result = await response.json()

      if (result.success) {
        setAssets(result.data.assets)
        setStats(result.data.stats)
      } else {
        // 如果API调用失败，使用模拟数据
        console.warn('API调用失败，使用模拟数据')
        const mockAssets: IPAsset[] = [
        {
          id: '1',
          title: '原创摄影作品《城市夜景》',
          description: '都市夜晚的绚烂光影，展现现代城市的独特魅力',
          contentType: 'image',
          status: 'completed',
          createdAt: '2024-03-15T10:30:00Z',
          txHash: '0x1234567890abcdef1234567890abcdef12345678',
          ipAssetId: 'ip_1001',
          contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
          contentScore: 85,
          rewardAmount: 250,
          views: 1250,
          earnings: 125.5
        },
        {
          id: '2',
          title: 'AI生成艺术系列',
          description: '使用最新AI技术创作的未来主义艺术作品',
          contentType: 'image',
          status: 'completed',
          createdAt: '2024-03-14T15:20:00Z',
          txHash: '0x2345678901bcdef12345678901bcdef23456789',
          ipAssetId: 'ip_1002',
          contractAddress: '0xbcdef12345678901bcdef12345678901bcdef123',
          contentScore: 72,
          rewardAmount: 100,
          views: 890,
          earnings: 67.8
        },
        {
          id: '3',
          title: '产品评测视频',
          description: '深度评测最新科技产品，为用户提供购买参考',
          contentType: 'video',
          status: 'processing',
          createdAt: '2024-03-16T09:15:00Z',
          txHash: '0x3456789012cdef123456789012cdef345678901',
          ipAssetId: 'ip_1003',
          contractAddress: '0xcdef123456789012cdef123456789012cdef1234',
          contentScore: 68,
          rewardAmount: 80,
          views: 0,
          earnings: 0
        }
      ]

      setAssets(mockAssets)

      // 计算统计数据
      const totalAssets = mockAssets.length
      const completedAssets = mockAssets.filter(asset => asset.status === 'completed').length
      const processingAssets = mockAssets.filter(asset => asset.status === 'processing').length
      const totalEarnings = mockAssets.reduce((sum, asset) => sum + (asset.earnings || 0), 0)

        setStats({
          totalAssets,
          completedAssets,
          totalEarnings,
          processingAssets
        })
      }

    } catch (error) {
      console.error('加载用户资产失败:', error)
      // 出错时显示空状态
      setAssets([])
      setStats({
        totalAssets: 0,
        completedAssets: 0,
        totalEarnings: 0,
        processingAssets: 0
      })
    } finally {
      setLoading(false)
    }
  }

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
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">已确权</Badge>
      case 'processing':
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
            <Button
              variant="outline"
              onClick={loadUserAssets}
              disabled={loading}
              className="bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 hover:text-white border-blue-500/30"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              刷新数据
            </Button>
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
            ) : assets.length === 0 ? (
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
                {assets.map((asset) => (
                  <Card key={asset.id} className="bg-slate-700/30 backdrop-blur-sm border-slate-600/50 hover:border-blue-500/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-white">{asset.title}</h4>
                            {getStatusBadge(asset.status)}
                          </div>
                          <p className="text-blue-200/70 text-sm mb-4">{asset.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-blue-200/50">内容评分</p>
                              <p className="text-sm font-medium text-white">{asset.contentScore}/100</p>
                            </div>
                            <div>
                              <p className="text-xs text-blue-200/50">代币奖励</p>
                              <p className="text-sm font-medium text-white">{asset.rewardAmount}</p>
                            </div>
                            {asset.views !== undefined && (
                              <div>
                                <p className="text-xs text-blue-200/50">浏览量</p>
                                <p className="text-sm font-medium text-white">{asset.views.toLocaleString()}</p>
                              </div>
                            )}
                            {asset.earnings !== undefined && (
                              <div>
                                <p className="text-xs text-blue-200/50">收益</p>
                                <p className="text-sm font-medium text-white">${asset.earnings.toFixed(2)}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-4 text-xs text-blue-200/70">
                            <span>创建时间: {formatDate(asset.createdAt)}</span>
                            <span>IP ID: {asset.ipAssetId}</span>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(asset.txHash)}
                            className="bg-slate-600/50 hover:bg-slate-500/50 text-blue-300 border-blue-500/30"
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            复制TX
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="bg-slate-600/50 hover:bg-slate-500/50 text-blue-300 border-blue-500/30"
                          >
                            <a href={`https://sepolia.etherscan.io/tx/${asset.txHash}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              查看
                            </a>
                          </Button>
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