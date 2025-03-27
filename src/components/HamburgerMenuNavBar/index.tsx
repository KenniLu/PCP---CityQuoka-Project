'use client'
// components/HamburgerMenu.jsx
import { useState, useRef, useEffect } from 'react'
import type { Header } from '@/payload-types'
import { PathActivatedLink } from '@/components/PathActivatedLink'
import Link from 'next/link'

type HamburgerMenuNavBarProps = {
  header: Header
}

// export default function HamburgerMenuNavBar() {
export const HamburgerMenuNavBar: React.FC<HamburgerMenuNavBarProps> = ({ header }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Toggle the menu
  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  // Close the menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef, buttonRef])

  // Calculate position of the slide panel
  const buttonHeight = buttonRef.current?.getBoundingClientRect()?.height || 0

  return (
    <div className="relative inline-block">
      {/* Hamburger Button */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="flex flex-col justify-center items-center p-2 rounded focus:outline-none"
        aria-label="Menu"
      >
        <span
          className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-gray-800 my-1 transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
        ></span>
      </button>

      {/* Slide Panel */}
      <div
        ref={menuRef}
        className={`absolute left-0 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-10 ${
          isOpen ? 'transform-none' : '-translate-x-[110%]'
        }`}
        style={{
          top: `${buttonHeight}px`,
          height: 'auto',
        }}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">City Guide</h2>
          <nav>
            <ul className="space-y-2 flex flex-col gap-2">
              {/* <li><a href="/" className="block py-2 hover:text-blue-600">Home</a></li>
              <li><a href="/about" className="block py-2 hover:text-blue-600">About</a></li>
              <li><a href="/services" className="block py-2 hover:text-blue-600">Services</a></li>
              <li><a href="/contact" className="block py-2 hover:text-blue-600">Contact</a></li>
              <li><a href="/dashboard" className="block py-2 hover:text-blue-600">Dashboard</a></li>
              <li><a href="/settings" className="block py-2 hover:text-blue-600">Settings</a></li> */}
              {(header?.navItems || []).map((navItem, indx) => (
                <li key={`navItem${indx}`}>
                  <PathActivatedLink pathMatch={navItem.link.url!} exactMatch={false}>
                    {/* <a href="/dashboard" className="block py-2 hover:text-blue-600">
                      Dashboard
                    </a> */}
                    <Link href={navItem.link.url!} onClick={closeMenu}>
                      {navItem.link.label!}
                    </Link>
                  </PathActivatedLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default HamburgerMenuNavBar
