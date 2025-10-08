'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { ImageOff } from 'lucide-react'

interface ImageFallbackProps extends Omit<ImageProps, 'onError'> {
    fallbackSrc?: string
}

export function ImageFallback({ fallbackSrc, alt, ...props }: ImageFallbackProps) {
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    if (error) {
        return (
            <div className="flex items-center justify-center bg-muted rounded-lg" style={{ width: props.width, height: props.height }}>
                <div className="text-center p-4">
                    <ImageOff className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">{alt}</p>
                </div>
            </div>
        )
    }

    return (
        <>
            {loading && (
                <div className="absolute inset-0 bg-muted animate-pulse rounded-lg" />
            )}
            <Image
                {...props}
                alt={alt}
                onError={() => {
                    if (fallbackSrc && props.src !== fallbackSrc) {
                        props.src = fallbackSrc
                    } else {
                        setError(true)
                    }
                }}
                onLoad={() => setLoading(false)}
            />
        </>
    )
}
