import React from 'react'
import Image from 'next/image'

const WhoAreWe = () => {
  return (
    <div className="my-28 max-md:mt-10 max-md:max-w-full pb-10">
      <div className="flex gap-5 max-md:flex-col">
        {/* First Section */}
        <div className="flex flex-col w-full sm:w-[33%] max-md:w-full">
          <div className="flex flex-col grow justify-center items-center px-16 py-2 w-full bg-green-500 rounded-lg border-black border-solid border-[3px] max-md:px-5 max-md:mt-8">
            <Image src="/icons/item1-1.svg" alt="Quokka Map" width={138} height={128} />
          </div>
        </div>

        {/* Second Section */}
        <div className="flex flex-col w-full sm:w-[33%] max-md:w-full relative">
          <div className="flex flex-col grow px-16 pb-24 w-full text-2xl font-bold tracking-tighter leading-none text-center text-black uppercase bg-yellow-500 rounded-lg border-black border-solid border-[3px] max-md:px-5 max-md:mt-8 relative">
            {/* Floating Button */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-3 py-2 bg-white rounded-lg border-black border-solid border-[3px] whitespace-nowrap">
              WHO ARE WE
            </div>

            {/* Centered Image */}
            <div className="flex justify-center mt-16 pt-3">
              <Image src="/icons/item1-2.svg" alt="Quokka Save" width={153} height={123} />
            </div>
          </div>
        </div>

        {/* Third Section */}
        <div className="flex flex-col w-full sm:w-[33%] max-md:w-full">
          <div className="flex flex-col grow px-16 pt-0.5 pb-16 w-full bg-violet-400 rounded-lg border-black border-solid border-[3px] max-md:px-5 max-md:mt-8  justify-center items-center">
            <Image src="/icons/item1-3.svg" alt="Quokka Party" width={173} height={240} />
          </div>
        </div>
      </div>

      <div className="mt-8 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          {/* First Text Section */}
          <div className="flex flex-col w-full sm:w-[33%] max-md:w-full">
            <div className="grow px-11 py-14 w-full text-[26px] tracking-tighter leading-8 text-center text-black bg-white rounded-lg border-green-500 border-solid border-[3px] font-author font-normal max-md:px-5 max-md:mt-8">
              A smart guide to your city that personalises to your interests
            </div>
          </div>

          {/* Second Text Section */}
          <div className="flex flex-col w-full sm:w-[33%] max-md:w-full">
            <div className="grow px-9 py-10 w-full text-[26px] tracking-tighter leading-8 text-center text-black bg-white rounded-lg border-yellow-500 border-solid border-[3px] font-author font-normal max-md:px-5 max-md:mt-8">
              We find and recommend the best experiences and negotiate special deals for our users.
            </div>
          </div>

          {/* Third Text Section */}
          <div className="flex flex-col w-full sm:w-[33%] max-md:w-full">
            <div className="grow px-9 py-10 w-full text-[26px] tracking-tighter leading-8 text-center text-black bg-white rounded-lg border-violet-400 border-solid border-[3px] font-author font-normal max-md:px-5 max-md:mt-8">
              No endless lists or overwhelming choices, just hand-picked options that you’ll love.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhoAreWe
