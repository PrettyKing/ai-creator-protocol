'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Copy, ExternalLink, Award, Coins, Home } from 'lucide-react'
import Link from 'next/link'
import { PageLayout } from '@/components/common'

function SuccessContent() {
  const searchParams = useSearchParams()
  
  const title = searchParams.get('title') || ''
  const score = searchParams.get('score') || '0'
  const grade = searchParams.get('grade') || 'D'
  const reward = searchParams.get('reward') || '0'
  const contractAddress = searchParams.get('contractAddress') || ''
  const tokenId = searchParams.get('tokenId') || ''

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // 这里可以添加复制成功的提示
  }

  const gradeColors = {
    S: 'text-yellow-600',
    A: 'text-green-600', 
    B: 'text-blue-600',
    C: 'text-orange-600',
    D: 'text-gray-600'
  }

  return (
    <PageLayout variant="light" headerVariant="simple">
        <div className="max-w-4xl mx-auto">
          {/* 成功提示 */}
          <div className="text-center mb-8">
            <CheckCircle className="h-24 w-24 text-green-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎉 版权注册成功！
            </h1>
            <p className="text-lg text-gray-600">
              你的内容已成功注册为链上IP资产，开启版权保护与变现之旅
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* 内容信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-6 w-6 mr-2 text-purple-600" />
                  内容详情
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">内容标题</label>
                    <p className="text-lg font-medium">{title}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">内容等级</label>
                      <p className={`text-2xl font-bold ${gradeColors[grade as keyof typeof gradeColors]}`}>
                        {grade} 级
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">影响力评分</label>
                      <p className="text-2xl font-bold text-gray-900">{score}/100</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 奖励信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coins className="h-6 w-6 mr-2 text-yellow-600" />
                  奖励详情
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="bg-yellow-50 rounded-full p-6 w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                    <div>
                      <Coins className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-yellow-800">{reward}</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold mb-2">恭喜获得 {reward} 个代币</p>
                  <p className="text-sm text-gray-600">
                    代币已发放至你的钱包地址
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 区块链信息 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>🔗 区块链信息</CardTitle>
              <CardDescription>
                你的内容已部署在区块链上，拥有不可篡改的版权证明
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    合约地址
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <code className="flex-1 text-sm font-mono">{contractAddress}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(contractAddress)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`https://basescan.org/address/${contractAddress}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Token ID
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <code className="flex-1 text-sm font-mono">#{tokenId}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(tokenId)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    网络
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Base Sepolia 测试网</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 后续步骤 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>📋 接下来你可以...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="font-semibold mb-2">查看仪表板</h3>
                  <p className="text-sm text-gray-600">管理你的所有IP资产</p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="font-semibold mb-2">设置商业授权</h3>
                  <p className="text-sm text-gray-600">开启内容变现模式</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <h3 className="font-semibold mb-2">分享版权证明</h3>
                  <p className="text-sm text-gray-600">向他人展示你的版权</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 操作按钮 */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="w-full sm:w-auto">
                  <Home className="h-5 w-5 mr-2" />
                  返回首页
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                上传更多内容
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                查看我的资产
              </Button>
            </div>
          </div>

          {/* 分享提示 */}
          <div className="mt-8 text-center text-gray-600">
            <p className="mb-2">🎉 分享这个好消息给朋友们吧！</p>
            <p className="text-sm">
              "我刚在 AI Creator Protocol 完成了内容版权注册，获得了 {reward} 个代币奖励！"
            </p>
          </div>
        </div>
    </PageLayout>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>加载中...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}