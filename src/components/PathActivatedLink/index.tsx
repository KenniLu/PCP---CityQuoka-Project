'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type StyleOptions = {
  activeClassName?: string;
  exactMatch?: boolean;
};

// Custom hook to determine if a path is active
export function useActivePath() {
  const pathname = usePathname();
  
  return (path: string, options: StyleOptions = {}) => {
    const { exactMatch = false } = options;
    
    if (exactMatch) {
      return pathname === path;
    }
    
    return pathname?.startsWith(path);
  };
}

// Style function that applies bold and underline to active links
export function useActiveStyle(path: string, exactMatch: boolean = false) {
  const isActive = useActivePath()(path, { exactMatch });
  
  return {
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: isActive ? 'underline' : 'none',
  };
}

// Component version that applies styling
interface PathActivatedLinkProps {
  pathMatch: string;
  exactMatch?: boolean;
  children: ReactNode;
}

export function PathActivatedLink({ pathMatch, exactMatch = false, children }: PathActivatedLinkProps) {
  const style = useActiveStyle(pathMatch, exactMatch);
  
  return <div style={style}>{children}</div>;
}
