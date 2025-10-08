'use client'

import Image from 'next/image'
import { useState } from 'react'
import { getOptimizedImageProps } from '@/lib/performance'

interface OptimizedImageProps {
    src: string
    alt: string
    width: number
    height: number
    quality?: number
    priority?: boolean
    className?: string
    fill?: boolean
    sizes?: string
    onLoad?: () => void
}

export function OptimizedImage({
    src,
    alt,
    width,
    height,
    quality = 75,
    priority = false,
    className = '',
    fill = false,
    sizes,
    onLoad
}: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    const imageProps = getOptimizedImageProps(src, width, height, quality)

    const handleLoad = () => {
        setIsLoading(false)
        onLoad?.()
    }

    const handleError = () => {
        setIsLoading(false)
        setHasError(true)
    }

    if (hasError) {
        return (
            <div
                className={`bg-gray-200 flex items-center justify-center ${className}`}
                style={{ width, height }}
                role="img"
                aria-label="Imagem não disponível - erro ao carregar"
            >
                <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>
        )
    }

    return (
        <div className={`relative ${className}`}>
            {isLoading && (
                <div
                    className="absolute inset-0 bg-gray-200 animate-pulse rounded"
                    style={{ width, height }}
                />
            )}
            <Image
                {...imageProps}
                alt={alt}
                priority={priority}
                fill={fill}
                sizes={sizes}
                className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                    } ${className}`}
                onLoad={handleLoad}
                onError={handleError}
            />
        </div>
    )
}