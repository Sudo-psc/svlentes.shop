'use client'

import { useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: string
  content: ReactNode
  badge?: string
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Tabs({
  items,
  defaultTab,
  onChange,
  variant = 'default',
  size = 'md',
  className = ''
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id)

  const handleTabChange = (tabId: string) => {
    if (items.find(item => item.id === tabId)?.disabled) return

    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const activeContent = items.find(item => item.id === activeTab)?.content

  const baseTabClasses = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'

  const variantClasses = {
    default: {
      container: 'border-b border-gray-200',
      tab: 'border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700',
      active: 'border-primary-600 text-primary-600',
      inactive: 'text-gray-500'
    },
    pills: {
      container: 'bg-gray-100 rounded-lg p-1',
      tab: 'rounded-md hover:bg-white hover:shadow-sm',
      active: 'bg-white shadow-sm text-primary-600',
      inactive: 'text-gray-600'
    },
    underline: {
      container: 'space-x-8',
      tab: 'border-b-2 border-transparent hover:border-primary-300',
      active: 'border-primary-600 text-primary-600',
      inactive: 'text-gray-500'
    }
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  }

  const currentVariant = variantClasses[variant]

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className={cn('flex', currentVariant.container)}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            disabled={item.disabled}
            className={cn(
              baseTabClasses,
              currentVariant.tab,
              sizeClasses[size],
              activeTab === item.id
                ? currentVariant.active
                : currentVariant.inactive,
              item.disabled && 'opacity-50 cursor-not-allowed',
              variant === 'pills' ? 'flex-1' : ''
            )}
          >
            <span className="flex items-center space-x-2">
              <span>{item.label}</span>
              {item.badge && (
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeContent}
      </div>
    </div>
  )
}

// Hook para controle externo das tabs
export function useTabs(initialTab?: string) {
  const [activeTab, setActiveTab] = useState(initialTab || '')

  return {
    activeTab,
    setActiveTab,
    isActive: (tabId: string) => activeTab === tabId
  }
}