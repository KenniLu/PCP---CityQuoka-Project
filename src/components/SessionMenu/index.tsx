'use client'

import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation';

// import Link from "next/link";

import { LogOut } from 'lucide-react'
import { AuthRequiredDialog } from '@/components/AuthRequiredDialog'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const SessionMenu: React.FC = ({}) => {
  const { data: session } = useSession()
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const pathname = usePathname();
  const router = useRouter();

  const handleAuthClick = ( ) => {
    if (pathname === '/') {
      router.push('/#signup-or-login');
    }else{
      setShowAuthDialog(true)
    }
  }

  if (session?.user) {
    const { user } = session
    return (
      <div className="flex gap-2.5 self-end text-base tracking-tight leading-snug max-md:mr-0.5 cursor-pointer">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={`rounded-full w-12 h-12 ring-2 ring-zinc-300 ring-offset`}>
              <Avatar className="rounded-full overflow-hidden w-12 h-12">
                <AvatarImage className="object-cover" />
                {/* <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback> */}
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel className="text-base">
              <div>Hi {user.firstName}!</div>
              <div className="text-base font-normal">{user.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup> */}
            {/* <DropdownMenuItem className="text-[18px]">
                <Settings />
                <span>My Account</span> */}
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
            {/* </DropdownMenuItem> */}
            {/* <DropdownMenuItem> */}
            {/* <CreditCard /> */}
            {/* <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem> */}
            {/* <Settings /> */}
            {/* <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem> */}
            {/* <Keyboard /> */}
            {/* <span>Keyboard shortcuts</span>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem> */}
            {/* </DropdownMenuGroup> */}

            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem className="text-base" onClick={() => signOut()}>
              <LogOut />
              <span>Log out</span>
              {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  } else {
    return (
      // <div className="flex justify-between items-center text-lg tracking-tight leading-snug text-black font-medium">
      //   <div className="flex justify-end w-full">
      //     <button
      //       // onClick={() => navigate("/signup")}
      //       className="hover:text-[#7642C8] transition-colors font-inter"
      //     >
      //       SignUp / LogIn
      //     </button>
      //   </div>
      //   <button className="w-10 h-10 rounded-full bg-zinc-300 ml-4"></button>{' '}
      //   {/* Icon to the right */}
      // </div>
      <>
      <div className="flex gap-2.5 self-end text-base tracking-tight leading-snug max-md:mr-0.5 cursor-pointer">
        {/* <Link href="/#signup-or-login"> */}
        <div className={`rounded-full w-12 h-12 ring-2 ring-zinc-300 ring-offset hover:cursor-pointer`} onClick={handleAuthClick}>
          <Avatar className="rounded-full overflow-hidden w-12 h-12">
            <AvatarImage className="object-cover" />
            {/* <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback> */}
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </div>
        {/* </Link> */}
      </div>
      <AuthRequiredDialog onOpenChange={setShowAuthDialog} isOpen={showAuthDialog} title='Login / Signup'>
        <h3 className="text-black">Log in to get personalised recommendations, save your favourites, and be the first to know about upcoming events, special offers, and more..</h3>
      </AuthRequiredDialog>
      </>
    )
  }
}
