import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrustBadgeProps {
  icon?: React.ReactNode
  text: string
  className?: string
}

export function TrustBadge({ icon, text, className }: TrustBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 p-3 rounded-lg bg-laas-gray-50 border border-laas-gray-200 hover:border-laas-success hover:bg-laas-success/5 transition-colors",
        className
      )}
    >
      <div className="flex-shrink-0 w-5 h-5 text-laas-success">
        {icon || <Check className="w-full h-full" strokeWidth={2.5} />}
      </div>
      <span className="text-sm font-medium text-laas-gray-700">{text}</span>
    </div>
  )
}

interface TrustBadgeGridProps {
  badges: Array<{
    text: string
    icon?: React.ReactNode
  }>
  className?: string
}

export function TrustBadgeGrid({ badges, className }: TrustBadgeGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {badges.map((badge, index) => (
        <TrustBadge key={index} {...badge} />
      ))}
    </div>
  )
}
