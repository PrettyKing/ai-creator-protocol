'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from '@/components/ui/button'
import { Shield, ArrowLeft, ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface AppHeaderProps {
  variant?: 'main' | 'simple'
  title?: string
  subtitle?: string
  showBackButton?: boolean
  backHref?: string
  backText?: string
}

export function AppHeader({ 
  variant = 'main', 
  title = 'AI Creator Protocol',
  subtitle = 'DeFi Creator Economy',
  showBackButton = false,
  backHref = '/',
  backText = '返回首页'
}: AppHeaderProps) {
  if (variant === 'simple') {
    return (
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Link href={backHref}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {backText}
                </Button>
              </Link>
            )}
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">{title}</span>
            </div>
          </div>
          <ConnectButton />
        </nav>
      </header>
    )
  }

  // Main header with cyberpunk styling
  return (
    <header className="relative z-10 bg-slate-900/95 backdrop-blur-md border-b border-blue-500/20">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {showBackButton && (
              <Link href={backHref}>
                <Button variant="ghost" className="text-blue-300 hover:text-white hover:bg-slate-700/50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {backText}
                </Button>
              </Link>
            )}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-30 animate-pulse"></div>
              </div>
              <div>
                <span className="text-lg font-bold text-white">{title}</span>
                <div className="text-xs text-blue-400">{subtitle}</div>
              </div>
            </div>
            {variant === 'main' && (
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
            )}
          </div>
          <ConnectButton />
        </nav>
      </div>
    </header>
  )
}