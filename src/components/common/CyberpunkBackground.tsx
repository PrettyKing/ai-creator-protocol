'use client'

interface CyberpunkBackgroundProps {
  particleCount?: number
  gridSize?: string
}

export function CyberpunkBackground({ 
  particleCount = 20, 
  gridSize = '50px 50px' 
}: CyberpunkBackgroundProps) {
  return (
    <div className="absolute inset-0">
      {/* Grid background */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: gridSize
        }}
      ></div>
      
      {/* Floating particles */}
      {[...Array(particleCount)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        ></div>
      ))}
    </div>
  )
}