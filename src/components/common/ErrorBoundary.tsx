'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

class ErrorBoundaryClass extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo })
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // 这里可以添加错误上报逻辑
    // reportErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return (
          <FallbackComponent
            error={this.state.error!}
            reset={() => this.setState({ hasError: false, error: undefined })}
          />
        )
      }

      return <DefaultErrorFallback error={this.state.error!} reset={() => this.setState({ hasError: false, error: undefined })} />
    }

    return this.props.children
  }
}

// 默认错误回退组件
function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  const isDev = process.env.NODE_ENV === 'development'

  const handleReload = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">
              哎呀，出现了一些问题
            </h1>
            <p className="text-red-200/80 mb-6">
              应用程序遇到了意外错误。我们已经记录了这个问题，请稍后再试。
            </p>

            {isDev && (
              <div className="bg-slate-900/50 p-4 rounded-lg mb-6 text-left">
                <h3 className="text-red-300 font-medium mb-2">错误详情（开发模式）：</h3>
                <code className="text-sm text-red-200 break-words">
                  {error.name}: {error.message}
                </code>
                {error.stack && (
                  <pre className="mt-2 text-xs text-red-300 whitespace-pre-wrap overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={reset}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                重试
              </Button>
              <Button
                variant="outline"
                onClick={handleReload}
                className="bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 hover:text-white border-blue-500/30 hover:border-blue-400/50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新页面
              </Button>
              <Button
                variant="outline"
                onClick={handleGoHome}
                className="bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 hover:text-white border-blue-500/30 hover:border-blue-400/50"
              >
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// HOC 包装器组件
export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <ErrorBoundaryClass fallback={fallback}>
      {children}
    </ErrorBoundaryClass>
  )
}

// Hook 用于在函数组件中处理错误
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    console.error('应用错误:', error, errorInfo)
    // 这里可以添加错误上报逻辑
  }
}