'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { AuthRequiredDialog } from '@/components/AuthRequiredDialog'

export default function SocialActions() {
  const { data: session } = useSession()
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  const recordReaction = (reaction: string) => {
    if (session?.user) {
      console.log(`Trying to save ${reaction}`)
    } else {
      setShowAuthDialog(true)
    }
  }
  return (
    <>
      <div className="flex gap-3 items-start self-start mt-1.5 text-sm">
        <button className="flex gap-1 self-stretch items-center hover:opacity-80" onClick={()=>recordReaction('like')}>
          <span>Like Article</span>
          <Image
            src="/icons/LikeIcon.svg"
            alt="Like"
            width={14}
            height={14}
            className="object-contain shrink-0 aspect-square w-[13px]"
          />
          <Image
            src="/icons/DividerIcon.svg"
            alt="Divider"
            className="object-contain shrink-0 w-px h-3"
            width={2}
            height={14}
          />
        </button>

        <button className="flex gap-1.5 items-center hover:opacity-80" onClick={()=>recordReaction('share')}>
          <span>Share Article</span>
          <Image
            src="/icons/ShareIcon.svg"
            alt="Share"
            className="object-contain shrink-0 w-4 aspect-[1.23]"
            width={14}
            height={14}
          />
          <Image
            src="/icons/DividerIcon.svg"
            alt="Divider"
            className="object-contain shrink-0 w-px h-3"
            width={2}
            height={14}
          />
        </button>

        <button className="flex gap-1.5 items-center hover:opacity-80" onClick={()=>recordReaction('save')}>
          <span>Save Article</span>
          <Image
            src="/icons/LoveIcon.svg"
            alt="Save"
            className="object-contain shrink-0 w-[13px] aspect-[1.18]"
            width={14}
            height={14}
          />
        </button>
      </div>
      <AuthRequiredDialog onOpenChange={setShowAuthDialog} isOpen={showAuthDialog}>
        <h3 className="text-black">
          Please log in or register to like, save and share this post.
        </h3>
      </AuthRequiredDialog>
    </>
  )
}
