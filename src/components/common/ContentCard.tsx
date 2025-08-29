'use client'

import { Button } from '@/components/ui/button'

interface ContentItem {
  id: number
  title: string
  creator: string
  type: string
  date: string
  status: string
  value: string
  gradient: string
}

interface ContentCardProps {
  item: ContentItem
}

export function ContentCard({ item }: ContentCardProps) {
  const getTypeEmoji = (type: string) => {
    switch (type) {
      case '图片': return '📷'
      case '视频': return '🎥'
      case '音频': return '🎵'
      default: return '📄'
    }
  }

  const getStatusStyle = (status: string) => {
    return status === '已确权' 
      ? 'bg-green-500/20 text-green-300 border-green-500/30'
      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
  }

  return (
    <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 cursor-pointer">
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300 blur-xl`}></div>
      
      <div className="relative h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
            <span className="text-white text-lg">
              {getTypeEmoji(item.type)}
            </span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(item.status)}`}>
            {item.status}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">{item.title}</h3>
            <p className="text-xs text-blue-300/70 mb-1">{item.creator}</p>
            <p className="text-xs text-blue-200/50">{item.date}</p>
          </div>
          
          <div className="pt-4 border-t border-blue-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">{item.value}</span>
              <Button variant="ghost" size="sm" className="text-xs h-7 px-3 bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 hover:text-white border border-blue-500/20">
                管理
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}