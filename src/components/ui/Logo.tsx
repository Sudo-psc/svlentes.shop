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
  sm: { width: 120, height: 40, textSize: 'text-lg', src: '/logosv-sm.webp' },
  md: { width: 180, height: 60, textSize: 'text-2xl', src: '/logosv-md.webp' },
  lg: { width: 240, height: 80, textSize: 'text-3xl', src: '/logosv-lg.webp' },
  xl: { width: 300, height: 100, textSize: 'text-4xl', src: '/logosv-xl.webp' }
}

export function Logo({
  variant = 'full',
  size = 'md',
  className,
  priority = false,
  showSubtitle = false
}: LogoProps) {
  const config = SIZE_CONFIG[size]

  // Full logo with image
  if (variant === 'full') {
    return (
      <div className={cn('flex items-center space-x-3', className)}>
        <div className="relative flex-shrink-0">
          <Image
            src={config.src}
            alt="SV Lentes - Saraiva Vision Oftalmologia"
            width={config.width}
            height={config.height}
            priority={priority}
            className="object-contain"
            quality={95}
            sizes={`(max-width: 768px) ${config.width}px, ${config.width}px`}
          />
        </div>
        {showSubtitle && (
          <div className="hidden lg:flex flex-col text-xs text-gray-600 dark:text-gray-300">
            <span className="font-medium">Saraiva Vision</span>
            <span className="text-primary-600 dark:text-primary-400 font-semibold">
              Dr. Philipe Saraiva Cruz
            </span>
          </div>
        )}
      </div>
    )
  }

  // Icon only (eye graphic from logo)
  if (variant === 'icon') {
    return (
      <div className={cn('relative flex-shrink-0', className)}>
        <Image
          src={config.src}
          alt="SV Lentes"
          width={config.height} // Square for icon
          height={config.height}
          priority={priority}
          className="object-contain"
          quality={95}
          sizes={`${config.height}px`}
        />
      </div>
    )
  }

  // Text only variant (fallback for loading or accessibility)
  return (
    <div className={cn('flex flex-col', className)}>
      <span className={cn(
        config.textSize,
        'font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent'
      )}>
        SV Lentes
      </span>
      {showSubtitle && (
        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
          Saraiva Vision Oftalmologia
        </span>
      )}
    </div>
  )
}

// Predefined logo variants for common use cases
export function LogoHeader() {
  return <Logo variant="full" size="md" priority showSubtitle />
}

export function LogoFooter() {
  return <Logo variant="full" size="lg" className="mb-4" />
}

export function LogoMobile() {
  return <Logo variant="icon" size="sm" priority />
}

export function LogoLoading() {
  return <Logo variant="text" size="md" />
}
