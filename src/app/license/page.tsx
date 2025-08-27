'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, ArrowLeft, Zap, Award, Coins } from 'lucide-react'
import Link from 'next/link'
import { LicenseAI } from '@/lib/ai-assistant'
import { ContentScorer } from '@/lib/scoring'
import { AIQuestion, LicenseTerms } from '@/types'

function LicenseContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 从URL获取内容信息
  const contentType = searchParams.get('contentType')
  const title = searchParams.get('title') || ''
  const score = parseInt(searchParams.get('score') || '0')
  const grade = searchParams.get('grade') || 'D'
  
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [licenseTerms, setLicenseTerms] = useState<LicenseTerms | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  
  const questions = LicenseAI.getQuestions()
  const scoreData = ContentScorer.getScoreGrade(score)
  const rewardAmount = ContentScorer.getRewardAmount(score)

  const handleAnswerSelect = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      generateLicense()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const generateLicense = async () => {
    setIsGenerating(true)
    try {
      const ai = new LicenseAI()
      const terms = await ai.generateLicenseTerms(answers)
      setLicenseTerms(terms)
      setCurrentStep(questions.length) // 进入预览步骤
    } catch (error) {
      console.error('生成授权条款失败:', error)
      // 使用默认条款
      const defaultTerms: LicenseTerms = {
        commercialUse: false,
        derivatives: false,
        attribution: true,
        shareAlike: true,
        territory: ['中国大陆'],
        channels: ['社交媒体'],
        timeframe: 12
      }
      setLicenseTerms(defaultTerms)
      setCurrentStep(questions.length)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeploy = async () => {
    setIsDeploying(true)
    
    // 模拟部署过程
    setTimeout(() => {
      // 跳转到成功页面
      const queryParams = new URLSearchParams({
        title,
        score: score.toString(),
        grade: scoreData.grade,
        reward: rewardAmount.toString(),
        contractAddress: '0x' + Math.random().toString(16).substr(2, 40), // 模拟合约地址
        tokenId: Math.floor(Math.random() * 10000).toString()
      })
      
      router.push(`/success?${queryParams.toString()}`)
    }, 3000)
  }

  const currentQuestion = questions[currentStep]
  const isLastStep = currentStep === questions.length
  const canProceed = currentQuestion ? answers[currentQuestion.id] : false

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Zap className="h-16 w-16 text-purple-600 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold mb-2">AI正在分析你的偏好</h3>
            <p className="text-gray-600">生成专属授权条款中...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/upload">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回上传
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">授权设置</span>
            </div>
          </div>
          <ConnectButton />
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 内容信息卡片 */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{title}</CardTitle>
                  <CardDescription>内容类型: {contentType === 'file' ? '文件上传' : '社交媒体'}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${scoreData.color}`}>{scoreData.grade}</div>
                      <div className="text-sm text-gray-500">等级</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{score}</div>
                      <div className="text-sm text-gray-500">评分</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center text-2xl font-bold text-yellow-600">
                        <Coins className="h-6 w-6 mr-1" />
                        {rewardAmount}
                      </div>
                      <div className="text-sm text-gray-500">代币奖励</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {!isLastStep ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Zap className="h-6 w-6 mr-2 text-purple-600" />
                    AI授权助手
                  </CardTitle>
                  <span className="text-sm text-gray-500">
                    {currentStep + 1} / {questions.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
                    
                    {currentQuestion.type === 'single' ? (
                      <div className="space-y-2">
                        {currentQuestion.options?.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              answers[currentQuestion.id] === option
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {currentQuestion.options?.map((option) => (
                          <label key={option} className="flex items-center space-x-3 p-3 rounded-lg border hover:border-gray-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(answers[currentQuestion.id] as string[] || []).includes(option)}
                              onChange={(e) => {
                                const currentAnswers = (answers[currentQuestion.id] as string[]) || []
                                if (e.target.checked) {
                                  handleAnswerSelect(currentQuestion.id, [...currentAnswers, option])
                                } else {
                                  handleAnswerSelect(currentQuestion.id, currentAnswers.filter(a => a !== option))
                                }
                              }}
                              className="rounded text-purple-600"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={currentStep === 0}
                      className="flex-1"
                    >
                      上一步
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!canProceed}
                      className="flex-1"
                    >
                      {currentStep === questions.length - 1 ? '生成授权条款' : '下一步'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            licenseTerms && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-6 w-6 mr-2 text-green-600" />
                    授权条款预览
                  </CardTitle>
                  <CardDescription>
                    AI已根据你的偏好生成授权条款，确认后将部署智能合约
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">
                        {LicenseAI.generateLicenseDescription(licenseTerms)}
                      </pre>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">📊 内容评分</h4>
                        <p className="text-blue-700">
                          等级: <span className="font-bold">{scoreData.grade}</span> ({scoreData.description})
                        </p>
                        <p className="text-blue-700">分数: {score}/100</p>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-2">🪙 代币奖励</h4>
                        <p className="text-yellow-700">
                          将获得 <span className="font-bold">{rewardAmount}</span> 个平台代币
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(0)}
                        className="flex-1"
                      >
                        重新设置
                      </Button>
                      <Button
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        className="flex-1"
                      >
                        {isDeploying ? '部署中...' : '确认并部署合约'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </main>
    </div>
  )
}

export default function LicensePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>加载中...</p>
        </div>
      </div>
    }>
      <LicenseContent />
    </Suspense>
  )
}