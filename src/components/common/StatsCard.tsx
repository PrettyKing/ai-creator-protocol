'use client'

import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  icon: LucideIcon
  label: string
  value: string
  gradient: string
}

export function StatsCard({ icon: IconComponent, label, value, gradient }: StatsCardProps) {
  return (
    <div className="relative bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4 hover:border-blue-400/40 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-200/70 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 bg-gradient-to-r ${gradient} rounded-lg`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300 blur-xl`}></div>
    </div>
  )
}