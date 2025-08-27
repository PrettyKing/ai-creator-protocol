'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Zap, Shield, Coins } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">AI Creator Protocol</span>
          </div>
          <ConnectButton />
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            保护你的创作，
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              实现版权变现
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            通过AI助手和Story Protocol，将你的社交媒体内容注册为链上IP资产，
            建立可编程的创作者经济系统。
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/upload">
              <Button size="lg" className="px-8">
                开始使用
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              了解更多
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Upload className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>内容注册</CardTitle>
              <CardDescription>
                上传内容或粘贴社交媒体链接，自动注册为链上IP资产
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Zap className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>AI授权助手</CardTitle>
              <CardDescription>
                智能问答生成标准授权条款，降低版权授权门槛
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Shield className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>链上确权</CardTitle>
              <CardDescription>
                部署智能合约，绑定授权条款，建立不可篡改的版权证明
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Coins className="h-10 w-10 text-yellow-600 mb-2" />
              <CardTitle>代币奖励</CardTitle>
              <CardDescription>
                基于内容影响力评分，获得平台代币奖励
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            工作流程
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">上传内容</h3>
              <p className="text-gray-600">上传图片/视频或输入社交媒体链接</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI生成授权</h3>
              <p className="text-gray-600">通过智能问答设置授权条款</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">链上部署</h3>
              <p className="text-gray-600">部署合约并获得代币奖励</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2024 AI Creator Protocol. Powered by Story Protocol.</p>
      </footer>
    </div>
  )
}