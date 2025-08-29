'use client'

import { Button } from '@/components/ui/button'
import { Upload, Database, Activity, TrendingUp, Cpu } from 'lucide-react'
import Link from 'next/link'
import { PageLayout, StatsCard, ContentCard } from '@/components/common'

export default function Home() {
  const statsData = [
    { icon: Database, label: '总资产', value: '1,256', gradient: 'from-blue-500 to-cyan-500' },
    { icon: Activity, label: '已确权', value: '1,089', gradient: 'from-green-500 to-emerald-500' },
    { icon: TrendingUp, label: '总收益', value: '$24.2k', gradient: 'from-purple-500 to-pink-500' },
    { icon: Cpu, label: '处理中', value: '167', gradient: 'from-orange-500 to-red-500' }
  ]

  const contentData = [
    {
      id: 1,
      title: "AI艺术作品合集",
      creator: "0x1234...5678",
      type: "图片",
      date: "2024-03-15",
      status: "已确权",
      value: "0.5 ETH",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      title: "科技评测视频",
      creator: "0x2345...6789", 
      type: "视频",
      date: "2024-03-14",
      status: "处理中",
      value: "0.3 ETH",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      title: "音乐原创作品",
      creator: "0x3456...7890",
      type: "音频", 
      date: "2024-03-13",
      status: "已确权",
      value: "0.8 ETH",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      title: "摄影作品系列",
      creator: "0x4567...8901",
      type: "图片",
      date: "2024-03-12", 
      status: "已确权",
      value: "1.2 ETH",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      id: 5,
      title: "设计作品展示",
      creator: "0x5678...9012",
      type: "图片",
      date: "2024-03-11",
      status: "已确权",
      value: "0.6 ETH",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      id: 6,
      title: "编程教学视频",
      creator: "0x6789...0123",
      type: "视频",
      date: "2024-03-10",
      status: "处理中",
      value: "0.4 ETH",
      gradient: "from-red-500 to-pink-500"
    }
  ]

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
            <Link href="/upload">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
                <Upload className="w-4 h-4 mr-2" />
                上传内容
              </Button>
            </Link>
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