'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { cn } from '@/utilities/cn'

type ClickableCarouselItemProps = {
  url: string
  children: React.ReactNode
  className: string
}

const ClickableCarouselItem: React.FC<ClickableCarouselItemProps> = ({
  url,
  children,
  className,
}) => {
  const router = useRouter()
  const handleClick = (e) => {
    router.push(url)
  }
  return (
    <div className={cn('hover:cursor-pointer', className)} onClick={handleClick}>
      {children}
    </div>
  )
}

export default ClickableCarouselItem
