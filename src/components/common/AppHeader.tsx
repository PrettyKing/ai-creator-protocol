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

  // Main header with Apple-style glass morphism
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-header">
      <div className="glass-bg"></div>
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between glass-nav-content">
          <div className="flex items-center space-x-8">
            {showBackButton && (
              <Link href={backHref}>
                <Button variant="ghost" className="glass-button liquid-ripple">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {backText}
                </Button>
              </Link>
            )}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg backdrop-filter backdrop-blur-sm">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-30 animate-pulse"></div>
              </div>
              <div>
                <span className="text-lg font-bold text-white drop-shadow-sm">{title}</span>
                <div className="text-xs text-blue-200/80">{subtitle}</div>
              </div>
            </div>
            {variant === 'main' && (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/upload" className="glass-nav-link liquid-ripple text-sm">
                  创作内容
                </Link>
                <Link href="/dashboard" className="glass-nav-link liquid-ripple text-sm">
                  资产管理
                </Link>
                <button className="glass-nav-link liquid-ripple text-sm">
                  收益统计
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