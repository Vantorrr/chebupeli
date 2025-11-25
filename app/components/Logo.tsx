'use client'

export function Logo({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const heightClasses = {
    sm: 'h-28',
    md: 'h-36',
    lg: 'h-44',
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="/velaro-logo.png"
        alt="Velaro"
        className={`${heightClasses[size]} w-auto object-contain`}
            style={{
              maxHeight: size === 'lg' ? '180px' : size === 'md' ? '144px' : '112px',
              width: 'auto',
              imageRendering: 'auto' as const
            }}
      />
    </div>
  )
}
