'use client'

import { Button } from '@/components/ui/button'
import { Upload, Database, Activity, TrendingUp, Cpu } from 'lucide-react'
import Link from 'next/link'
import { PageLayout, StatsCard, ContentCard } from '@/components/common'
import { MockDataService } from '@/lib/mock-data-service'

export default function Home() {
  // 获取真实统计数据
  const globalStats = MockDataService.getGlobalStats()
  const latestAssets = MockDataService.getLatestAssets(6)

  const statsData = [
    { icon: Database, label: '总资产', value: globalStats.totalAssets.toString(), gradient: 'from-blue-500 to-cyan-500' },
    { icon: Activity, label: '已确权', value: globalStats.registeredAssets.toString(), gradient: 'from-green-500 to-emerald-500' },
    { icon: TrendingUp, label: '总收益', value: `${globalStats.totalEarnings} 代币`, gradient: 'from-purple-500 to-pink-500' },
    { icon: Cpu, label: '用户数', value: globalStats.totalUsers.toString(), gradient: 'from-orange-500 to-red-500' }
  ]

  // 将最新资产转换为内容数据格式
  const contentData = latestAssets.map((asset, index) => ({
    id: asset.id,
    title: asset.title,
    creator: `${asset.creator_address.slice(0, 6)}...${asset.creator_address.slice(-4)}`,
    type: asset.content_type === 'image' ? '图片' :
          asset.content_type === 'video' ? '视频' :
          asset.content_type === 'audio' ? '音频' :
          asset.content_type === 'text' ? '文本' :
          asset.content_type === 'code' ? '代码' : asset.content_type,
    date: new Date(asset.created_at).toLocaleDateString('zh-CN'),
    status: asset.status === 'registered' ? '已确权' :
            asset.status === 'pending' ? '处理中' :
            asset.status === 'failed' ? '失败' : asset.status,
    value: asset.ip_asset_id ? `${(Math.random() * 2 + 0.1).toFixed(1)} ETH` : '待定',
    gradient: [
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-purple-500 to-pink-500",
      "from-yellow-500 to-orange-500",
      "from-pink-500 to-rose-500",
      "from-red-500 to-pink-500"
    ][index % 6]
  }))

  return (
    <PageLayout variant="cyberpunk" headerVariant="main" showFooter>

      {/* Header section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">数据资产
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 ml-2">
              管理中心
            </span>
          </h1>
        </div>
        <p className="text-blue-200/80">管理和查看您的链上IP资产，实现数据价值最大化</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main content area */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-blue-500/20 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-blue-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button className="relative text-sm font-medium text-white border-b-2 border-blue-400 pb-2">
                全部内容
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
              </button>
              <button className="text-sm text-blue-200/70 hover:text-white pb-2 transition-colors duration-200">
                已确权
              </button>
              <button className="text-sm text-blue-200/70 hover:text-white pb-2 transition-colors duration-200">
                处理中
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" className="bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 hover:text-white border-blue-500/30 hover:border-blue-400/50">
                  <Database className="w-4 h-4 mr-2" />
                  我的资产
                </Button>
              </Link>
              <Link href="/upload">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
                  <Upload className="w-4 h-4 mr-2" />
                  上传内容
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {contentData.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}