'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Zap, Shield, Coins, ChevronDown, Database, Activity, TrendingUp, Cpu } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <header className="relative z-10 bg-slate-900/95 backdrop-blur-md border-b border-blue-500/20">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-30 animate-pulse"></div>
                </div>
                <div>
                  <span className="text-lg font-bold text-white">AI Creator Protocol</span>
                  <div className="text-xs text-blue-400">DeFi Creator Economy</div>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <button className="group flex items-center space-x-1 text-sm text-blue-200 hover:text-white transition-colors duration-200">
                  <span>创作内容</span>
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </button>
                <button className="group flex items-center space-x-1 text-sm text-blue-200 hover:text-white transition-colors duration-200">
                  <span>版权管理</span>
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <button className="group text-sm text-blue-200 hover:text-white transition-colors duration-200 relative">
                  统计
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </button>
              </div>
            </div>
            <ConnectButton />
          </nav>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-8">
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
          {[
            { icon: Database, label: '总资产', value: '1,256', color: 'from-blue-500 to-cyan-500' },
            { icon: Shield, label: '已确权', value: '1,089', color: 'from-green-500 to-emerald-500' },
            { icon: TrendingUp, label: '总收益', value: '$24.2k', color: 'from-purple-500 to-pink-500' },
            { icon: Cpu, label: '处理中', value: '167', color: 'from-orange-500 to-red-500' }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="relative bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4 hover:border-blue-400/40 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200/70 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300 blur-xl`}></div>
              </div>
            );
          })}
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
              {[
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
              ].map((item) => (
                <div key={item.id} className="group relative bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 cursor-pointer">
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300 blur-xl`}></div>
                  
                  <div className="relative h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                        <span className="text-white text-lg">
                          {item.type === '图片' ? '📷' : item.type === '视频' ? '🎥' : '🎵'}
                        </span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        item.status === '已确权' 
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                      }`}>
                        {item.status}
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-xs text-blue-300/70 mb-1">{item.creator}</p>
                        <p className="text-xs text-blue-200/50">{item.date}</p>
                      </div>
                      
                      <div className="pt-4 border-t border-blue-500/20">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">{item.value}</span>
                          <Button variant="ghost" size="sm" className="text-xs h-7 px-3 bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 hover:text-white border border-blue-500/20">
                            管理
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-blue-500/20 bg-slate-900/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-blue-200/60">&copy; 2024 AI Creator Protocol. Powered by Story Protocol.</p>
            <div className="flex items-center space-x-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}