import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CyberpunkCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glow' | 'accent'
}

export function CyberpunkCard({
  className,
  variant = 'default',
  children,
  ...props
}: CyberpunkCardProps) {
  const baseClass = "bg-slate-800/50 backdrop-blur-sm border-blue-500/20"

  const variantClasses = {
    default: baseClass,
    glow: `${baseClass} shadow-lg shadow-blue-500/10`,
    accent: `${baseClass} border-cyan-500/30 shadow-lg shadow-cyan-500/10`
  }

  return (
    <Card
      className={cn(variantClasses[variant], className)}
      {...props}
    >
      {children}
    </Card>
  )
}