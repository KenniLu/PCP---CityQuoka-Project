import React from 'react'
import Image from 'next/image'

const WhoAreWe = () => {
  return (
    // <div className="my-16 md:my-28 max-w-full p-4">
    <div className="my-16 w-full max-w-[1122px] mx-auto">
      {/* Grid Container for All 6 Items */}
      <div className="grid grid-cols-3 gap-2 md:gap-5">
        {/* First Section */}
        <div className="flex flex-col w-full">
          <div className="flex flex-col grow justify-center items-center px-2 md:px-4 py-3 md:py-8 w-full bg-green-500 rounded-lg border-black border-solid border-[2px] md:border-[3px]">
            {/* <img 
              src={item1} 
              alt="Item 1" 
              className="w-[60px] h-[60px] md:w-[138px] md:h-[128px]" 
            /> */}
            <Image src="/icons/item1-1.svg" alt="Quokka Map" width={138} height={128} />
          </div>
        </div>

        {/* Second Section */}
        <div className="flex flex-col w-full relative">
          <div className="flex flex-col grow px-2 md:px-4 py-3 md:py-8 w-full text-lg md:text-2xl font-bold tracking-tighter leading-none text-center text-black uppercase bg-yellow-500 rounded-lg border-black border-solid border-[2px] md:border-[3px] relative">
            {/* Floating Button */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-2 md:px-3 py-1 md:py-2 bg-black rounded-md md:rounded-lg border-white border-solid border-[1px] md:border-2 outline outline-[2px] md:outline-[3px] outline-white whitespace-nowrap text-[#FFB200] text-xl md:text-xl">
              WHO ARE WE
            </div>

            {/* Centered Image */}
            <div className="flex justify-center mt-8 md:mt-16 pt-1 md:pt-3">
              {/* <img 
                src={item2} 
                alt="Item 2" 
                className="w-[60px] h-[48px] md:w-[153px] md:h-[123px]" 
              /> */}
              <Image src="/icons/item1-2.svg" alt="Quokka Save" width={153} height={123} />
            </div>
          </div>
        </div>

        {/* Third Section */}
        <div className="flex flex-col w-full">
          <div className="flex flex-col grow px-2 md:px-4 py-3 md:py-8 w-full bg-violet-400 rounded-lg border-black border-solid border-[2px] md:border-[3px] justify-center items-center">
            {/* <img 
              src={item3} 
              alt="Item 3" 
              className="w-[70px] h-[105px] md:w-[173px] md:h-[240px]" 
            /> */}
            <Image src="/icons/item1-3.svg" alt="Quokka Party" width={173} height={240} />
          </div>
        </div>

        {/* First Text Section */}
        <div className="flex flex-col w-full">
          <div className="grow px-2 md:px-4 py-2 md:py-6 w-full text-xs md:text-[26px] tracking-tighter leading-4 md:leading-8 text-center text-black bg-white rounded-lg border-green-500 border-solid border-[2px] md:border-[3px] font-[596]">
            A smart guide to your city that personalises to your interests
          </div>
        </div>

        {/* Second Text Section */}
        <div className="flex flex-col w-full">
          <div className="grow px-2 md:px-4 py-2 md:py-6 w-full text-xs md:text-[26px] tracking-tighter leading-4 md:leading-8 text-center text-black bg-white rounded-lg border-yellow-500 border-solid border-[2px] md:border-[3px] font-[596]">
            We find and recommend the best experiences and negotiate special deals for our users.
          </div>
        </div>

        {/* Third Text Section */}
        <div className="flex flex-col w-full">
          <div className="grow px-2 md:px-4 py-2 md:py-6 w-full text-xs md:text-[26px] tracking-tighter leading-4 md:leading-8 text-center text-black bg-white rounded-lg border-violet-400 border-solid border-[2px] md:border-[3px] font-[596]">
            No endless lists or overwhelming choices, just hand-picked options that you&#39;ll love.
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhoAreWe
