'use client'

import { ShadcnDemo } from "@/components/examples/ShadcnDemo"

// Force dynamic rendering to prevent prerender issues with ThemeProvider
export const dynamic = 'force-dynamic'

export default function ShadcnDemoPage() {
    return <ShadcnDemo />
}