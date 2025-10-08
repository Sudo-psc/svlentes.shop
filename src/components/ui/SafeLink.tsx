'use client'

import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode, MouseEvent } from 'react'

interface SafeLinkProps extends LinkProps {
    children: ReactNode
    className?: string
    fallbackUrl?: string
}

export function SafeLink({ children, href, fallbackUrl = '/', className, ...props }: SafeLinkProps) {
    const router = useRouter()

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        try {
            if (props.onClick) {
                props.onClick(e)
            }
        } catch (error) {
            console.error('Erro ao navegar:', error)
            e.preventDefault()
            router.push(fallbackUrl)
        }
    }

    return (
        <Link href={href} className={className} {...props} onClick={handleClick}>
            {children}
        </Link>
    )
}
