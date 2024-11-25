'use client'

import { useAuth } from '@/providers/AuthProvider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { signOut } from "next-auth/react"

import {
  Settings,
  LogOut
} from 'lucide-react'

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
  const { user } = useAuth()
  if (user) {
    return (
      <div className="flex gap-2.5 self-end text-lg tracking-tight leading-snug max-md:mr-0.5 cursor-pointer">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={`rounded-full w-12 h-12 ring-2 ring-zinc-300 ring-offset`}>
              <Avatar className="rounded-full overflow-hidden w-12 h-12">
                <AvatarImage src={user?.image} alt={user?.name?.[0]} className="object-cover" />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel className="text-[18px]">
              <div className="font-author font-normal">Hi {user.name}!</div>
              <div>{user.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-[18px]">
                <Settings />
                <span>My Account</span>
                {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
              </DropdownMenuItem>
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
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[18px]" onClick={() => signOut()}>
              <LogOut />
              <span>Log out</span>
              {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  } else {
    return(<div className="flex gap-2.5 self-end text-lg tracking-tight leading-snug max-md:mr-0.5 cursor-pointer">
      Login
    </div>)
  }
}
