'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Zap, Shield, Coins, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">AI Creator Protocol</span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                  <span>创作内容</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                  <span>版权管理</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900">统计</button>
              </div>
            </div>
            <ConnectButton />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">创作内容</h1>
          <p className="text-sm text-gray-500">管理和查看您的链上IP资产</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="text-sm font-medium text-gray-900 border-b-2 border-gray-900 pb-2">
                  全部内容
                </button>
                <button className="text-sm text-gray-500 hover:text-gray-900 pb-2">
                  已确权
                </button>
                <button className="text-sm text-gray-500 hover:text-gray-900 pb-2">
                  处理中
                </button>
              </div>
              <Link href="/upload">
                <Button size="sm" className="bg-gray-900 hover:bg-gray-800">
                  上传内容
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[
                {
                  id: 1,
                  title: "AI艺术作品合集",
                  creator: "0x1234...5678",
                  type: "图片",
                  date: "2024-03-15",
                  status: "已确权",
                  value: "0.5 ETH"
                },
                {
                  id: 2,
                  title: "科技评测视频",
                  creator: "0x2345...6789", 
                  type: "视频",
                  date: "2024-03-14",
                  status: "处理中",
                  value: "0.3 ETH"
                },
                {
                  id: 3,
                  title: "音乐原创作品",
                  creator: "0x3456...7890",
                  type: "音频", 
                  date: "2024-03-13",
                  status: "已确权",
                  value: "0.8 ETH"
                },
                {
                  id: 4,
                  title: "摄影作品系列",
                  creator: "0x4567...8901",
                  type: "图片",
                  date: "2024-03-12", 
                  status: "已确权",
                  value: "1.2 ETH"
                },
                {
                  id: 5,
                  title: "设计作品展示",
                  creator: "0x5678...9012",
                  type: "图片",
                  date: "2024-03-11",
                  status: "已确权",
                  value: "0.6 ETH"
                },
                {
                  id: 6,
                  title: "编程教学视频",
                  creator: "0x6789...0123",
                  type: "视频",
                  date: "2024-03-10",
                  status: "处理中",
                  value: "0.4 ETH"
                }
              ].map((item) => (
                <div key={item.id} className="aspect-square bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
                  <div className="h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-lg">
                          {item.type === '图片' ? '📷' : item.type === '视频' ? '🎥' : '🎵'}
                        </span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === '已确权' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-xs text-gray-500 mb-1">{item.creator}</p>
                        <p className="text-xs text-gray-400">{item.date}</p>
                      </div>
                      
                      <div className="pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                          <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
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

      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="container mx-auto px-6 py-6">
          <p className="text-xs text-gray-500">&copy; 2024 AI Creator Protocol. Powered by Story Protocol.</p>
        </div>
      </footer>
    </div>
  )
}