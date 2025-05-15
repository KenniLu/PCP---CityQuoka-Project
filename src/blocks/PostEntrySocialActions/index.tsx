'use client'

import React, { useState } from 'react'
// import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { AuthRequiredDialog } from '@/components/AuthRequiredDialog'
import { useReactions } from '@/providers/ReactionsProvider'
import { Heart, Bookmark, Copy } from 'lucide-react'

export default function SocialActions({ postId }: { postId: number }) {
  const { data: session } = useSession()
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const { isLoading, toggleReaction, isReacted } = useReactions()
  const isLiked = isReacted(postId, 'like')
  const isSaved = isReacted(postId, 'save')
  const [isCopied, setIsCopied] = useState(false)

  const updateReaction = (reaction: 'like' | 'save') => {
    if (session?.user) {
      if (reaction === 'like' || reaction === 'save') toggleReaction(postId, reaction)
    } else {
      setShowAuthDialog(true)
    }
  }

  const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000) 
    } catch (err) {
        console.error("Failed to copy the link: ", err)
    }
  }

  if (isLoading) {
    return null
  }
  return (
    <>
      <div className="flex items-center justify-center rounded-lg">
        {/* Like section */}
        <button onClick={() => updateReaction('like')} className="flex items-center group px-4">
          <Heart
            size={20}
            className={`transition-colors duration-200 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500 group-hover:text-gray-700'}`}
          />
          <span
            className={`text-sm ml-2 ${isLiked ? 'text-red-500' : 'text-gray-500 group-hover:text-gray-700'}`}
          >
            Like
          </span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300"></div>

        {/* Save section */}
        <button onClick={() => updateReaction('save')} className="flex items-center group px-4">
          <Bookmark
            size={20}
            className={`transition-colors duration-200 ${isSaved ? 'fill-blue-500 text-blue-500' : 'text-gray-500 group-hover:text-gray-700'}`}
          />
          <span
            className={`text-sm ml-2 ${isSaved ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-700'}`}
          >
            Save
          </span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300"></div>

        {/* Share section - copy link */} 
        <button onClick={copyToClipboard} className="flex items-center group px-4">
          <Copy
            size={20}
            className={`transition-colors duration-200 ${isCopied ? 'fill-green-500 text-green-500' : 'text-gray-500 group-hover:text-gray-700'}`}
          />
          <span className={`text-sm ml-2 ${isCopied ? 'text-green-500' : 'text-gray-500 group-hover:text-gray-700'}`}
          >
            Copy      
          </span>
        </button>
      </div>
      <AuthRequiredDialog onOpenChange={setShowAuthDialog} isOpen={showAuthDialog}>
        <h3 className="text-black">Please log in or register to like, save and share this post.</h3>
      </AuthRequiredDialog>
    </>
  )
}
