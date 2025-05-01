'use client'

import React, { createContext, useContext } from 'react'
import { useSession } from "next-auth/react";
import useSWR from 'swr';

type Reactions = {[postId: string]: {like?: boolean; share?: boolean}} | {};

type ReactionsContextType = {
  reactions: Reactions;
  isLoading: boolean;
  toggleReaction: (postId: number, reaction: 'like' | 'save') => void;
  isReacted: (postId: number, reaction: 'like' | 'save') => boolean;
}

const ReactionsContext = createContext<ReactionsContextType|undefined>(undefined)

export function ReactionsProvider({ postIds, children }: {postIds: number[], children: React.ReactNode}){
  const { data: session, status } = useSession()
  const isAuthenticated = !!session?.user;

  // Fetch user's reactions only if authenticated
  const { data, error, mutate } = useSWR(
    isAuthenticated ? `/api/posts/reactions?postIds=${postIds.join(",")}` : null,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch reactions');
      return res.json();
    }
  );

  const reactions = data?.reactions || [];

  const isLoading = status === 'loading' || (isAuthenticated && !data && !error);

  const isReacted = (postId: number, reaction: 'like' | 'save'): boolean => {
    if (!isAuthenticated || isLoading) return false;
    return (reactions[postId.toString()]||{})[reaction]
  };

  // Toggle reaction with optimistic update
  const toggleReaction = async (postId: number, reaction: 'like' | 'save') => {
    if (!isAuthenticated) return;
    
    const hasReaction = isReacted(postId, reaction);
    const _postId = postId.toString()

    // Update local cache
    mutate({
      ...reactions,
      [_postId]: {
        ...(reactions[_postId] || {}),
        [reaction]: !hasReaction
      }
    }, false);

    const _reaction = hasReaction ? `un${reaction}` : reaction

    // Send API request
    try {
      await fetch('/api/posts/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, reaction: _reaction }),
      });
      
      // Revalidate the data
      mutate();
    } catch (error) {
      console.error('Error toggling reaction:', error);
      // Revert on error
      mutate();
    }
  };

  const value = {
    reactions,
    isLoading,
    toggleReaction,
    isReacted
  }

  return(<ReactionsContext.Provider value={value}>
    {children}
  </ReactionsContext.Provider>);
}

export const useReactions = () => {
  const context = useContext(ReactionsContext);
  if (context === undefined) {
    throw new Error('useReactions must be used within a ReactionsProvider');
  }
  return context;
};