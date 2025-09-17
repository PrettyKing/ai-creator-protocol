'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Award, Coins } from 'lucide-react'
import { PageLayout } from '@/components/common'
import { LicenseAI } from '@/lib/ai-assistant'
import { ContentScorer } from '@/lib/scoring'
import { AIQuestion, LicenseTerms } from '@/types'

function LicenseContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { address, isConnected } = useAccount()
  
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
    if (!licenseTerms) return
    
    setIsDeploying(true)
    
    try {
      // 获取社交媒体数据（如果有）
      const socialMetricsParam = searchParams.get('socialMetrics')
      let socialMetrics = null
      if (socialMetricsParam) {
        try {
          socialMetrics = JSON.parse(socialMetricsParam)
        } catch (e) {
          console.warn('解析社交媒体数据失败:', e)
        }
      }

      // 调用Story Protocol注册API
      const response = await fetch('/api/story/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description: searchParams.get('description') || '',
          contentHash: searchParams.get('contentHash') || 'QmExample...',
          metadataHash: searchParams.get('metadataHash') || '',
          creator: address || searchParams.get('creator') || '',
          licenseTerms,
          socialMetrics
        }),
      })

      if (!response.ok) {
        throw new Error('注册失败')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error?.message || '注册失败')
      }

      // 跳转到成功页面
      const queryParams = new URLSearchParams({
        title,
        score: result.data.contentScore.toString(),
        grade: scoreData.grade,
        reward: result.data.rewardAmount.toString(),
        contractAddress: result.data.contractAddress,
        tokenId: result.data.tokenId,
        txHash: result.data.txHash
      })
      
      router.push(`/success?${queryParams.toString()}`)
      
    } catch (error) {
      console.error('部署失败:', error)
      alert(error instanceof Error ? error.message : '部署失败，请重试')
    } finally {
      setIsDeploying(false)
    }
  }

  const currentQuestion = questions[currentStep]
  const isLastStep = currentStep === questions.length
  const canProceed = currentQuestion ? answers[currentQuestion.id] : false

  if (isGenerating) {
    return (
      <PageLayout
        variant="cyberpunk"
        headerVariant="main"
        headerTitle="授权设置"
        headerSubtitle="License Configuration"
        showBackButton
        backHref="/upload"
        backText="返回上传"
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm border-blue-500/20">
            <CardContent className="text-center py-12">
              <Zap className="h-16 w-16 text-blue-400 mx-auto mb-6 animate-pulse" />
              <h3 className="text-xl font-semibold text-white mb-4">AI正在分析你的偏好</h3>
              <p className="text-blue-200/80">生成专属授权条款中...</p>
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
      headerTitle="授权设置"
      headerSubtitle="License Configuration"
      showBackButton
      backHref="/upload"
      backText="返回上传"
    >
        <div className="max-w-4xl mx-auto">
          {/* 内容信息卡片 */}
          <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-blue-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-white">{title}</CardTitle>
                  <CardDescription className="text-blue-200/70">内容类型: {contentType === 'file' ? '文件上传' : '社交媒体'}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${scoreData.color}`}>{scoreData.grade}</div>
                      <div className="text-sm text-blue-200/50">等级</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{score}</div>
                      <div className="text-sm text-blue-200/50">评分</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center text-2xl font-bold text-yellow-400">
                        <Coins className="h-6 w-6 mr-1" />
                        {rewardAmount}
                      </div>
                      <div className="text-sm text-blue-200/50">代币奖励</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {!isLastStep ? (
            <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-white">
                    <Zap className="h-6 w-6 mr-2 text-blue-400" />
                    AI授权助手
                  </CardTitle>
                  <span className="text-sm text-blue-200/50">
                    {currentStep + 1} / {questions.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">{currentQuestion.question}</h3>
                    
                    {currentQuestion.type === 'single' ? (
                      <div className="space-y-2">
                        {currentQuestion.options?.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              answers[currentQuestion.id] === option
                                ? 'border-blue-400 bg-blue-500/20 text-white'
                                : 'border-slate-600 hover:border-blue-500/50 text-blue-200 hover:text-white bg-slate-700/30 hover:bg-slate-600/50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {currentQuestion.options?.map((option) => (
                          <label key={option} className="flex items-center space-x-3 p-3 rounded-lg border border-slate-600 hover:border-blue-500/50 bg-slate-700/30 hover:bg-slate-600/50 cursor-pointer transition-colors">
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
                              className="rounded text-blue-500 focus:ring-blue-500"
                            />
                            <span className="text-blue-200">{option}</span>
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
                      className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 hover:text-white border-blue-500/30 hover:border-blue-400/50"
                    >
                      上一步
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!canProceed}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white disabled:opacity-50"
                    >
                      {currentStep === questions.length - 1 ? '生成授权条款' : '下一步'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            licenseTerms && (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Award className="h-6 w-6 mr-2 text-green-400" />
                    授权条款预览
                  </CardTitle>
                  <CardDescription className="text-blue-200/70">
                    AI已根据你的偏好生成授权条款，确认后将部署智能合约
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-slate-700/50 border border-slate-600 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-blue-200">
                        {LicenseAI.generateLicenseDescription(licenseTerms)}
                      </pre>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-500/20 border border-blue-500/30 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-300 mb-2">📊 内容评分</h4>
                        <p className="text-blue-200">
                          等级: <span className="font-bold text-white">{scoreData.grade}</span> ({scoreData.description})
                        </p>
                        <p className="text-blue-200">分数: <span className="text-white">{score}/100</span></p>
                      </div>

                      <div className="bg-yellow-500/20 border border-yellow-500/30 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-300 mb-2">🪙 代币奖励</h4>
                        <p className="text-yellow-200">
                          将获得 <span className="font-bold text-white">{rewardAmount}</span> 个平台代币
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(0)}
                        className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 hover:text-white border-blue-500/30 hover:border-blue-400/50"
                      >
                        重新设置
                      </Button>
                      <Button
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white disabled:opacity-50"
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
    </PageLayout>
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