import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from 'src/utilities/cn'
import Link from 'next/link'
import React from 'react'
import findLongestArray from '@/utilities/findLongestArray'

import type { Category, Page, Post } from '@/payload-types'
import {format} from '@/hooks/formatSlug'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  // const href =
  //   type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
  //     ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
  //         reference.value.slug
  //       }`
  //     : url

  let href = url;

  if (type === 'reference' && typeof reference?.value === 'object' && reference.value.slug) {
    if (reference?.relationTo === 'posts') {
      const categoryPaths = ((reference.value as Post)?.categories||[]).map((cat: Category) => (cat?.breadcrumbs||[]).map((crumb) => crumb.label))
      const longestCategoryPath = findLongestArray(categoryPaths)
      if(!longestCategoryPath){
        return null
      }else{
        href = `/cityguide/${longestCategoryPath.map((category) => format(category!)).join('/')}/posts/${reference.value.slug}`
      }
    } else if (reference?.relationTo === 'pages') {
      href = `/${reference.value.slug}`;
    } else {
      href = `/${reference?.relationTo}/${reference.value.slug}`;
    }
  }

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
