import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'full' | 'icon' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  priority?: boolean
  showSubtitle?: boolean
}

const SIZE_CONFIG = {
  sm: { width: 120, height: 40, iconSize: 32, textSize: 'text-lg', fontSize: 'text-xl' },
  md: { width: 160, height: 54, iconSize: 42, textSize: 'text-2xl', fontSize: 'text-2xl' },
  lg: { width: 200, height: 68, iconSize: 52, textSize: 'text-3xl', fontSize: 'text-3xl' },
  xl: { width: 280, height: 95, iconSize: 72, textSize: 'text-4xl', fontSize: 'text-4xl' }
}

export function Logo({
  variant = 'full',
  size = 'md',
  className,
  priority = false,
  showSubtitle = false
}: LogoProps) {
  const config = SIZE_CONFIG[size]

  // Full logo with icon + text
  if (variant === 'full') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        {/* Eye Icon with Heart */}
        <div className="relative flex-shrink-0" style={{ width: config.iconSize, height: config.iconSize }}>
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-md"
            aria-hidden="true"
          >
            {/* Eye Outline */}
            <path
              d="M100 60C60 60 30 100 30 100s30 40 70 40 70-40 70-40-30-40-70-40z"
              stroke="url(#gradient1)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Iris Circle */}
            <circle
              cx="100"
              cy="100"
              r="25"
              stroke="url(#gradient2)"
              strokeWidth="6"
              fill="none"
            />
            {/* Heart in Center */}
            <path
              d="M100 85c-3-3-8-3-11 0-3 3-3 8 0 11l11 11 11-11c3-3 3-8 0-11-3-3-8-3-11 0z"
              fill="url(#gradient3)"
              className="animate-pulse"
            />
            {/* Gradients */}
            <defs>
              <linearGradient id="gradient1" x1="30" y1="60" x2="170" y2="140">
                <stop offset="0%" stopColor="#1e3a8a" className="dark:stop-color-[#3b82f6]" />
                <stop offset="100%" stopColor="#0ea5e9" className="dark:stop-color-[#60a5fa]" />
              </linearGradient>
              <linearGradient id="gradient2" x1="75" y1="75" x2="125" y2="125">
                <stop offset="0%" stopColor="#0066CC" className="dark:stop-color-[#3b82f6]" />
                <stop offset="100%" stopColor="#0ea5e9" className="dark:stop-color-[#60a5fa]" />
              </linearGradient>
              <linearGradient id="gradient3" x1="89" y1="85" x2="111" y2="107">
                <stop offset="0%" stopColor="#0066CC" className="dark:stop-color-[#3b82f6]" />
                <stop offset="100%" stopColor="#0ea5e9" className="dark:stop-color-[#60a5fa]" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* SVlentes Text */}
        <div className="flex flex-col">
          <span
            className={cn(
              config.fontSize,
              'font-bold leading-none',
              'bg-gradient-to-r from-[#1e3a8a] via-[#0066CC] to-[#0ea5e9]',
              'dark:from-[#3b82f6] dark:via-[#60a5fa] dark:to-[#0ea5e9]',
              'bg-clip-text text-transparent',
              'drop-shadow-sm'
            )}
          >
            SVlentes
          </span>
          {showSubtitle && (
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-0.5">
              Saraiva Vision
            </span>
          )}
        </div>
      </div>
    )
  }

  // Icon only (eye with heart)
  if (variant === 'icon') {
    return (
      <div className={cn('relative flex-shrink-0', className)} style={{ width: config.iconSize, height: config.iconSize }}>
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
          aria-label="SVlentes"
        >
          <path
            d="M100 60C60 60 30 100 30 100s30 40 70 40 70-40 70-40-30-40-70-40z"
            stroke="url(#gradient1-icon)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle
            cx="100"
            cy="100"
            r="25"
            stroke="url(#gradient2-icon)"
            strokeWidth="6"
            fill="none"
          />
          <path
            d="M100 85c-3-3-8-3-11 0-3 3-3 8 0 11l11 11 11-11c3-3 3-8 0-11-3-3-8-3-11 0z"
            fill="url(#gradient3-icon)"
          />
          <defs>
            <linearGradient id="gradient1-icon" x1="30" y1="60" x2="170" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e3a8a" className="dark:stop-color-[#3b82f6]" />
              <stop offset="100%" stopColor="#0ea5e9" className="dark:stop-color-[#60a5fa]" />
            </linearGradient>
            <linearGradient id="gradient2-icon" x1="75" y1="75" x2="125" y2="125" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0066CC" className="dark:stop-color-[#3b82f6]" />
              <stop offset="100%" stopColor="#0ea5e9" className="dark:stop-color-[#60a5fa]" />
            </linearGradient>
            <linearGradient id="gradient3-icon" x1="89" y1="85" x2="111" y2="107" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0066CC" className="dark:stop-color-[#3b82f6]" />
              <stop offset="100%" stopColor="#0ea5e9" className="dark:stop-color-[#60a5fa]" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    )
  }

  // Text only variant (fallback for loading or accessibility)
  return (
    <div className={cn('flex flex-col', className)}>
      <span className={cn(
        config.textSize,
        'font-bold leading-none',
        'bg-gradient-to-r from-[#1e3a8a] via-[#0066CC] to-[#0ea5e9]',
        'dark:from-[#3b82f6] dark:via-[#60a5fa] dark:to-[#0ea5e9]',
        'bg-clip-text text-transparent',
        'drop-shadow-sm'
      )}>
        SVlentes
      </span>
      {showSubtitle && (
        <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold mt-1">
          Saraiva Vision Oftalmologia
        </span>
      )}
    </div>
  )
}

// Predefined logo variants for common use cases
export function LogoHeader() {
  return <Logo variant="full" size="md" priority className="hover:scale-105 transition-transform duration-200" />
}

export function LogoFooter() {
  return <Logo variant="full" size="lg" showSubtitle className="mb-4 hover:scale-105 transition-transform duration-200" />
}

export function LogoMobile() {
  return <Logo variant="icon" size="sm" priority />
}

export function LogoLoading() {
  return <Logo variant="text" size="md" />
}
