// 'use client'
import React from 'react'
// import Image from 'next/image'
import Link from 'next/link'
import { PathActivatedLink } from '@/components/PathActivatedLink'
// import { usePathname } from 'next/navigation'

const HomeNavBar = () => {
  // const [selectedButton, setSelectedButton] = useState('')
  // const pathname = usePathname()

  // const getFontWeight = (buttonName) => {
  //   // return selectedButton === buttonName || currentPath === buttonName ? "font-bold" : "font-normal";
  //   // return 'font-bold underline'
  //   return 'font-normal'
  // }

  // const handleButtonClick = (buttonName) => {
  //   setSelectedButton(buttonName)
  // }

  return (
    <div className="max-w-[1120px] mx-auto w-full">
      <div className="flex justify-center w-full">
        <div className="max-w-[1120px] h-[40px] flex items-center justify-center w-full">
          <div className="flex flex-nowrap gap-9 items-center">
            {/* <p className="text-xl text-[#EFEFEF] hidden sm:block">|</p> */}

            {/* Nightlife Button */}
            <PathActivatedLink pathMatch="/" exactMatch={true}>
              <Link href="/">
                <button
                  className={`my-auto whitespace-nowrap flex items-center gap-2 text-xl`}
                  // style={{ fontFamily: 'Inter', fontSize: '18px' }}
                  // onClick={() => handleButtonClick('nightlife')}
                >
                  {/* <img src={nightlife} alt="nightlife icon" className="w-5 h-5" /> */}
                  <span className="hidden sm:inline-block">Home</span>
                </button>
              </Link>
            </PathActivatedLink>
            <p className="text-xl text-[#EFEFEF] hidden sm:block">|</p>

            {/* Sport Button */}
            <PathActivatedLink pathMatch="/cityguide" exactMatch={false}>
              <Link href="/cityguide">
                <button
                  className={`my-auto whitespace-nowrap flex items-center gap-2 text-xl`}
                  // style={{ fontFamily: 'Inter', fontSize: '18px' }}
                  // onClick={() => handleButtonClick('sport')}
                >
                  {/* <img src={sport} alt="sport icon" className="w-5 h-5" /> */}
                  <span className="hidden sm:inline-block">City Guide</span>
                </button>
              </Link>
            </PathActivatedLink>
            <p className="text-xl text-[#EFEFEF] hidden sm:block">|</p>

            {/* Markets Button */}
            <PathActivatedLink pathMatch="/business" exactMatch={false}>
              <Link href="/business">
                <button
                  className={`my-auto whitespace-nowrap flex items-center gap-2 text-xl`}
                  // style={{ fontFamily: 'Inter', fontSize: '18px' }}
                  // onClick={() => handleButtonClick('markets')}
                >
                  {/* <img src={markets} alt="markets icon" className="w-5 h-5" /> */}
                  <span className="hidden sm:inline-block">I&#39;m A Business</span>
                </button>
              </Link>
            </PathActivatedLink>
            {/* <p className="text-xl text-[#EFEFEF] hidden sm:block">|</p> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeNavBar
