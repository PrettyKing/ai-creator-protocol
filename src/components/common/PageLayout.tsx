'use client'

import { ReactNode } from 'react'
import { AppHeader } from './AppHeader'
import { CyberpunkBackground } from './CyberpunkBackground'

interface PageLayoutProps {
  children: ReactNode
  variant?: 'cyberpunk' | 'light'
  headerVariant?: 'main' | 'simple'
  headerTitle?: string
  headerSubtitle?: string
  showBackButton?: boolean
  backHref?: string
  backText?: string
  showFooter?: boolean
  className?: string
}

export function PageLayout({
  children,
  variant = 'cyberpunk',
  headerVariant = 'main',
  headerTitle,
  headerSubtitle,
  showBackButton = false,
  backHref = '/',
  backText = '返回首页',
  showFooter = false,
  className = ''
}: PageLayoutProps) {
  const containerClasses = variant === 'cyberpunk' 
    ? `min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden flex flex-col ${className}`
    : `min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col ${className}`

  return (
    <div className={containerClasses}>
      {variant === 'cyberpunk' && <CyberpunkBackground />}
      
      <AppHeader 
        variant={headerVariant}
        title={headerTitle}
        subtitle={headerSubtitle}
        showBackButton={showBackButton}
        backHref={backHref}
        backText={backText}
      />

      <main className={`${variant === 'cyberpunk' ? 'relative z-10 ' : ''}container mx-auto px-6 py-8 flex-1 ${headerVariant === 'main' ? 'pt-24' : 'pt-8'}`}>
        {children}
      </main>

      {showFooter && (
        <footer className="relative z-10 border-t border-blue-500/20 bg-slate-900/50 backdrop-blur-sm mt-auto">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-blue-200/60">&copy; 2024 AI Creator Protocol. Powered by Story Protocol.</p>
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">All Systems Operational</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}