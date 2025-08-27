'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Upload, Link2, ArrowLeft, FileImage, Video } from 'lucide-react'
import Link from 'next/link'
import { ContentMetadata, SocialMetrics } from '@/types'
import { ContentScorer } from '@/lib/scoring'

export default function UploadPage() {
  const router = useRouter()
  const [contentType, setContentType] = useState<'file' | 'social-link' | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [socialUrl, setSocialUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // 模拟社交媒体数据解析
  const handleSocialUrlSubmit = () => {
    if (!socialUrl.trim()) return
    
    // 这里应该调用API解析社交媒体链接
    // 现在使用模拟数据
    const mockMetrics: SocialMetrics = {
      followers: 50000,
      views: 120000,
      likes: 8500,
      comments: 320,
      shares: 180,
      platform: 'tiktok'
    }
    
    const score = ContentScorer.calculateScore(mockMetrics)
    const grade = ContentScorer.getScoreGrade(score)
    
    // 跳转到授权设置页面，携带数据
    const queryParams = new URLSearchParams({
      contentType: 'social-link',
      socialUrl,
      title: title || '来自社交媒体的内容',
      description: description || '',
      score: score.toString(),
      grade: grade.grade
    })
    
    router.push(`/license?${queryParams.toString()}`)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      if (!title) {
        setTitle(selectedFile.name)
      }
    }
  }

  const handleFileSubmit = () => {
    if (!file || !title.trim()) return
    
    setIsProcessing(true)
    
    // 模拟文件处理和评分
    setTimeout(() => {
      // 文件上传通常有基础分数
      const baseScore = Math.floor(Math.random() * 30) + 20 // 20-50分
      const grade = ContentScorer.getScoreGrade(baseScore)
      
      const queryParams = new URLSearchParams({
        contentType: 'file',
        fileName: file.name,
        title,
        description: description || '',
        score: baseScore.toString(),
        grade: grade.grade
      })
      
      router.push(`/license?${queryParams.toString()}`)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回首页
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">内容上传</span>
            </div>
          </div>
          <ConnectButton />
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              上传你的创作内容
            </h1>
            <p className="text-lg text-gray-600">
              选择上传文件或输入社交媒体链接，开始你的版权保护之旅
            </p>
          </div>

          {!contentType ? (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-200"
                    onClick={() => setContentType('file')}>
                <CardHeader className="text-center">
                  <Upload className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                  <CardTitle className="text-2xl">上传文件</CardTitle>
                  <CardDescription>
                    直接上传图片或视频文件进行版权注册
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FileImage className="h-4 w-4 mr-1" />
                      图片
                    </div>
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-1" />
                      视频
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-200"
                    onClick={() => setContentType('social-link')}>
                <CardHeader className="text-center">
                  <Link2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-2xl">社交媒体链接</CardTitle>
                  <CardDescription>
                    输入抖音、小红书、Instagram等平台的内容链接
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span>🎵 抖音</span>
                    <span>📱 小红书</span>
                    <span>📷 Instagram</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {contentType === 'file' ? (
                      <>
                        <Upload className="h-6 w-6 mr-2 text-purple-600" />
                        文件上传
                      </>
                    ) : (
                      <>
                        <Link2 className="h-6 w-6 mr-2 text-blue-600" />
                        社交媒体链接
                      </>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {contentType === 'file' 
                      ? '上传你的创作文件并填写基本信息' 
                      : '输入社交媒体内容链接，系统将自动解析数据'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contentType === 'file' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          选择文件
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            {file ? (
                              <div>
                                <FileImage className="h-12 w-12 text-green-600 mx-auto mb-2" />
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-gray-500">点击重新选择</p>
                              </div>
                            ) : (
                              <div>
                                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">点击选择文件或拖拽到此处</p>
                                <p className="text-xs text-gray-500">支持 JPG, PNG, MP4, MOV 格式</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        内容链接
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.douyin.com/video/..."
                        value={socialUrl}
                        onChange={(e) => setSocialUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        支持抖音、小红书、Instagram、微博等平台链接
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      内容标题 *
                    </label>
                    <input
                      type="text"
                      placeholder="给你的内容起个标题"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      内容描述
                    </label>
                    <textarea
                      placeholder="简单描述一下你的内容（可选）"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setContentType(null)}
                      className="flex-1"
                    >
                      返回选择
                    </Button>
                    <Button
                      onClick={contentType === 'file' ? handleFileSubmit : handleSocialUrlSubmit}
                      disabled={
                        isProcessing || 
                        !title.trim() || 
                        (contentType === 'file' && !file) || 
                        (contentType === 'social-link' && !socialUrl.trim())
                      }
                      className="flex-1"
                    >
                      {isProcessing ? '处理中...' : '下一步：设置授权'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}