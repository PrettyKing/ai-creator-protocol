'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Upload, Link2, FileImage, Video, Sparkles, Zap, Wallet } from 'lucide-react'
import { PageLayout } from '@/components/common'
import { ContentMetadata, SocialMetrics } from '@/types'
import { ContentScorer } from '@/lib/scoring'
import { useUser, useAssets } from '@/hooks/useDatabase'

export default function UploadPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [contentType, setContentType] = useState<'file' | 'social-link' | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [socialUrl, setSocialUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // 调用社交媒体数据解析API
  const handleSocialUrlSubmit = async () => {
    if (!socialUrl.trim()) return
    
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/social/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ socialUrl }),
      })

      if (!response.ok) {
        throw new Error('解析失败')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error?.message || '数据解析失败')
      }

      const metrics: SocialMetrics = result.data
      const score = ContentScorer.calculateScore(metrics)
      const grade = ContentScorer.getScoreGrade(score)
    
      // 跳转到授权设置页面，携带数据
      const queryParams = new URLSearchParams({
        contentType: 'social-link',
        socialUrl,
        title: title || '来自社交媒体的内容',
        description: description || '',
        score: score.toString(),
        grade: grade.grade,
        socialMetrics: JSON.stringify(metrics),
        creator: address || ''
      })
      
      router.push(`/license?${queryParams.toString()}`)
      
    } catch (error) {
      console.error('社交媒体解析失败:', error)
      alert(error instanceof Error ? error.message : '解析失败，请检查链接格式')
    } finally {
      setIsProcessing(false)
    }
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

  const handleFileSubmit = async () => {
    if (!file || !title.trim()) return

    // 检查钱包连接状态
    if (!isConnected) {
      alert('请先连接钱包')
      return
    }

    setIsProcessing(true)

    try {
      // 上传文件到IPFS
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('creator', address || '')

      const response = await fetch('/api/upload/ipfs', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('文件上传失败')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || '文件上传失败')
      }

      // 文件上传通常有基础分数
      const baseScore = Math.floor(Math.random() * 30) + 20 // 20-50分
      const grade = ContentScorer.getScoreGrade(baseScore)

      const queryParams = new URLSearchParams({
        contentType: 'file',
        fileName: file.name,
        title,
        description: description || '',
        score: baseScore.toString(),
        grade: grade.grade,
        contentHash: result.data.fileHash,
        metadataHash: result.data.metadataHash,
        creator: address || ''
      })

      router.push(`/license?${queryParams.toString()}`)

    } catch (error) {
      console.error('文件上传失败:', error)
      alert(error instanceof Error ? error.message : '文件上传失败，请重试')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <PageLayout 
      variant="cyberpunk" 
      headerVariant="main" 
      headerTitle="内容上传"
      headerSubtitle="Data Asset Upload"
      showBackButton
      backHref="/"
      backText="返回首页"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full border border-blue-500/20 shadow-lg mb-6">
            <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-300">内容资产化</span>
          </div>

          {/* 钱包连接状态 */}
          <div className="mb-6">
            {isConnected ? (
              <div className="inline-flex items-center px-4 py-2 bg-green-500/10 backdrop-blur-sm rounded-full border border-green-500/20 shadow-lg">
                <Wallet className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-sm font-medium text-green-300">
                  钱包已连接: {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center px-4 py-2 bg-red-500/10 backdrop-blur-sm rounded-full border border-red-500/20 shadow-lg">
                <Wallet className="w-4 h-4 text-red-400 mr-2" />
                <span className="text-sm font-medium text-red-300">请先连接钱包</span>
              </div>
            )}
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            上传你的
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 ml-2">
              数字资产
            </span>
          </h1>
          <p className="text-xl text-blue-200/80 max-w-2xl mx-auto">
            选择上传文件或输入社交媒体链接，将创作转化为可编程的数字资产
          </p>
        </div>

        {!contentType ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div 
              className="group relative bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-400/40 transition-all duration-500 hover:scale-105 cursor-pointer"
              onClick={() => setContentType('file')}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 blur-xl"></div>
              
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-110 mb-6">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">文件上传</h3>
                <p className="text-blue-200/80 mb-6">
                  直接上传图片或视频文件进行版权注册和资产化处理
                </p>
                
                <div className="flex items-center justify-center space-x-6 text-sm text-blue-300/80">
                  <div className="flex items-center">
                    <FileImage className="h-5 w-5 mr-2" />
                    图片资产
                  </div>
                  <div className="flex items-center">
                    <Video className="h-5 w-5 mr-2" />
                    视频资产
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="group relative bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-400/40 transition-all duration-500 hover:scale-105 cursor-pointer"
              onClick={() => setContentType('social-link')}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 blur-xl"></div>
              
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg group-hover:shadow-blue-500/50 transition-all duration-500 group-hover:scale-110 mb-6">
                  <Link2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">社交媒体链接</h3>
                <p className="text-blue-200/80 mb-6">
                  输入抖音、小红书、Instagram等平台的内容链接进行资产化
                </p>
                
                <div className="flex items-center justify-center space-x-4 text-sm text-blue-300/80">
                  <span className="flex items-center">
                    🎵 <span className="ml-1">抖音</span>
                  </span>
                  <span className="flex items-center">
                    📱 <span className="ml-1">小红书</span>
                  </span>
                  <span className="flex items-center">
                    📷 <span className="ml-1">Instagram</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-blue-500/20">
                <h3 className="flex items-center text-xl font-bold text-white">
                  {contentType === 'file' ? (
                    <>
                      <Upload className="h-6 w-6 mr-3 text-purple-400" />
                      文件上传
                    </>
                  ) : (
                    <>
                      <Link2 className="h-6 w-6 mr-3 text-blue-400" />
                      社交媒体链接
                    </>
                  )}
                </h3>
                <p className="text-blue-200/70 mt-2">
                  {contentType === 'file' 
                    ? '上传你的创作文件并填写基本信息，开启资产化之旅' 
                    : '输入社交媒体内容链接，系统将自动解析并评估数据价值'
                  }
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                {contentType === 'file' ? (
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-3">
                      选择文件
                    </label>
                    <div className="relative border-2 border-dashed border-blue-500/30 rounded-xl p-8 text-center hover:border-blue-400/50 transition-colors duration-300">
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
                            <FileImage className="h-16 w-16 text-green-400 mx-auto mb-4" />
                            <p className="text-white font-medium">{file.name}</p>
                            <p className="text-blue-300/70 text-sm mt-2">点击重新选择文件</p>
                          </div>
                        ) : (
                          <div>
                            <Upload className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                            <p className="text-blue-200 mb-2">点击选择文件或拖拽到此处</p>
                            <p className="text-blue-300/70 text-sm">支持 JPG, PNG, MP4, MOV 等格式</p>
                          </div>
                        )}
                      </label>
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none"></div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-3">
                      内容链接
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.douyin.com/video/..."
                      value={socialUrl}
                      onChange={(e) => setSocialUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-blue-500/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    <p className="text-blue-300/70 text-sm mt-2">
                      支持抖音、小红书、Instagram、微博等平台链接
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-3">
                    内容标题 *
                  </label>
                  <input
                    type="text"
                    placeholder="给你的数字资产起个标题"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-blue-500/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-3">
                    内容描述
                  </label>
                  <textarea
                    placeholder="描述一下你的数字资产特点（可选）"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-blue-500/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setContentType(null)}
                    className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 hover:text-white border-blue-500/30 hover:border-blue-400/50"
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
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isProcessing ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-spin" />
                        处理中...
                      </>
                    ) : (
                      '下一步：AI授权设置'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}