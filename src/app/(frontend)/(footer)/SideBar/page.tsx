'use client'

import { PathActivatedLink } from '@/components/PathActivatedLink'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

type FixedMenuProps = {
  onClick: () => void
}

const FixedMenu = ({ onClick }) => (
  <div className="w-64 h-screen p-6 bg-quokka-yellow text-black shadow-lg">
    <ul className="mt-2 flex flex-col gap-4">
      <li>
        <Link href="/" onClick={onClick}>
          <button className={`text-2xl hover:text-gray-900 duration-500 text-white`}>
            <PathActivatedLink pathMatch="/" exactMatch={true}>
              Home
            </PathActivatedLink>
          </button>
        </Link>
      </li>

      <li>
        <Link href="/about-us" onClick={onClick}>
          <button className={`text-xl hover:text-orange-100 duration-500`}>
            <PathActivatedLink pathMatch="/about-us" exactMatch={false}>
              About Us
            </PathActivatedLink>
          </button>
        </Link>
      </li>

      <li>
        <Link href="/contact-us" onClick={onClick}>
          <button className={`text-xl hover:text-orange-100 duration-500`}>
            <PathActivatedLink pathMatch="/contact-us" exactMatch={false}>
              Contact Us
            </PathActivatedLink>
          </button>
        </Link>
      </li>

      <li>
        <Link href="/cookies" onClick={onClick}>
          <button className={`text-xl hover:text-orange-100 duration-500`}>
            <PathActivatedLink pathMatch="/cookies" exactMatch={false}>
              Cookies
            </PathActivatedLink>
          </button>
        </Link>
      </li>

      <li>
        <Link href="/term-of-use" onClick={onClick}>
          <button className={`text-xl hover:text-orange-100 duration-500`}>
            <PathActivatedLink pathMatch="/term-of-use" exactMatch={false}>
              Term of Use
            </PathActivatedLink>
          </button>
        </Link>
      </li>

      <li>
        <Link href="/private-policy" onClick={onClick}>
          <button className={`text-xl hover:text-orange-100 duration-500`}>
            <PathActivatedLink pathMatch="/private-policy" exactMatch={false}>
              Private Policy
            </PathActivatedLink>
          </button>
        </Link>
      </li>
    </ul>
  </div>
)

const CollapsibleMenu = () => {
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
          isOpen ? 'transform-none' : '-translate-x-[200%]'
        }`}
        style={{
          top: `${buttonHeight}px`,
          height: 'auto',
        }}
      >
        {/* <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <nav>
            <FixedMenu />
          </nav>
        </div> */}
        <FixedMenu onClick={closeMenu} />
      </div>
    </div>
  )
}

const SideBar = () => {
  return (
    <>
      <div className="block md:hidden">
        <CollapsibleMenu />
      </div>
      <div className="hidden md:block">
        <FixedMenu onClick={() => {}} />
      </div>
    </>
  )
}

export default SideBar
