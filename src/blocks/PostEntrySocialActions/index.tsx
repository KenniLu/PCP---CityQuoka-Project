'use client'

import React, { useState } from 'react'
// import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { AuthRequiredDialog } from '@/components/AuthRequiredDialog'
import { useReactions } from '@/providers/ReactionsProvider'
import { Heart, Bookmark, Upload } from 'lucide-react';

export default function SocialActions({ postId }: { postId: number }) {
  const { data: session } = useSession()
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const { isLoading, toggleReaction, isReacted } = useReactions()
  const isLiked = isReacted(postId, 'like')
  const isSaved = isReacted(postId, 'save')

  const updateReaction = ( reaction: 'like'|'save'|'share') => {
    if(session?.user){
      if ( reaction === 'like' || reaction === 'save')
      toggleReaction(postId, reaction)
    }else{
      setShowAuthDialog(true)
    }
  }

  if (isLoading) {
    return null
  }
  return (
    <>
      {/* <div className="flex gap-3 items-start self-start mt-1.5 text-sm">
        <button
          className="flex gap-1 self-stretch items-center hover:opacity-80"
          onClick={() => toggleReaction(postId, 'like')}
        >
          <span>Like Article</span>
          <Image
            src="/icons/LikeIcon.svg"
            alt="Like"
            width={14}
            height={14}
            className="object-contain shrink-0 aspect-square w-[13px] text-blue-500"
          />
          <Image
            src="/icons/DividerIcon.svg"
            alt="Divider"
            className="object-contain shrink-0 w-px h-3"
            width={2}
            height={14}
          />
        </button>

        <button
          className="flex gap-1.5 items-center hover:opacity-80"
          // onClick={() => toggleReaction(postId, 'save')}
        >
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

        <button
          className="flex gap-1.5 items-center hover:opacity-80"
          onClick={() => toggleReaction(postId, 'save')}
        >
          <span>Save Article</span>
          <Image
            src="/icons/LoveIcon.svg"
            alt="Save"
            className="object-contain shrink-0 w-[13px] aspect-[1.18]"
            width={14}
            height={14}
          />
        </button>
      </div> */}
    <div className="flex items-center justify-center rounded-lg">
      {/* Like section */}
      <button 
        onClick={() => updateReaction('like')}
        className="flex items-center group px-4"
      >
        <Heart 
          size={20} 
          className={`transition-colors duration-200 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500 group-hover:text-gray-700'}`}
        />
        <span className={`text-sm ml-2 ${isLiked ? 'text-red-500' : 'text-gray-500 group-hover:text-gray-700'}`}>
          Like
        </span>
      </button>
      
      {/* Divider */}
      <div className="h-8 w-px bg-gray-300"></div>
      
      {/* Save section */}
      <button 
        onClick={() => updateReaction('save')}
        className="flex items-center group px-4"
      >
        <Bookmark 
          size={20} 
          className={`transition-colors duration-200 ${isSaved ? 'fill-blue-500 text-blue-500' : 'text-gray-500 group-hover:text-gray-700'}`}
        />
        <span className={`text-sm ml-2 ${isSaved ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-700'}`}>
          Save
        </span>
      </button>
      
      {/* Divider */}
      <div className="h-8 w-px bg-gray-300"></div>
      
      {/* Share section */}
      <button 
        onClick={() => updateReaction('share')}
        className="flex items-center group px-4"
      >
        <Upload 
          size={20} 
          className="text-gray-500 group-hover:text-gray-700 transition-colors duration-200"
        />
        <span className="text-sm ml-2 text-gray-500 group-hover:text-gray-700">
          Share
        </span>
      </button>
    </div>
      <AuthRequiredDialog onOpenChange={setShowAuthDialog} isOpen={showAuthDialog}>
        <h3 className="text-black">Please log in or register to like, save and share this post.</h3>
      </AuthRequiredDialog>
    </>
  )
}
