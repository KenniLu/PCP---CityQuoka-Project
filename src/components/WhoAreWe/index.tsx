import React from 'react'
import Image from 'next/image'

const WhoAreWe = () => {
  return (
    <div className="mt-4 mb-16 w-full max-w-[1122px] mx-auto">
      <div className="translate-y-1/2 flex flex-col text-lg md:text-2xl font-bold tracking-tighter leading-none text-center text-black uppercase bg-quokka-yellow rounded-lg border-black border-solid relative w-48 mx-auto">
        <div className="z-10 px-2 md:px-3 py-1 md:py-2 bg-black rounded-[0.25rem] border-white border-solid border-[1px] md:border-2 outline outline-[2px] md:outline-[3px] outline-white whitespace-nowrap text-quokka-yellow text-base">
          WHO ARE WE
        </div>
      </div>

      {/* <div className="grid grid-cols-3 gap-2 md:gap-5"> */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* First Section */}
        <div className="flex flex-col w-full md:w-1/3">
          {/* <div className="h-64 flex flex-col grow justify-center items-center px-2 md:px-4 py-3 md:py-8 w-full bg-quokka-green rounded-lg border-black border-solid border-[2px] md:border-[3px]"> */}
          <div className="h-64 flex flex-col grow justify-center items-center px-2 md:px-4 py-3 w-full bg-quokka-green rounded-lg border-black border-solid border-[2px] md:border-[3px]">
            <Image src="/icons/item1-1.svg" alt="Quokka Map" width={138} height={128} />
          </div>
          <div className="h-24 md:h-56 grow mt-2 px-2 md:px-4 w-full text-xl md:text-2xl tracking-tighter leading-8 text-center text-black bg-white rounded-lg border-quokka-green border-solid border-[2px] md:border-[3px] font-[596]">
            <p className="py-4 md:py-6 my-2">
              A smart guide to your city that personalises to your interests
            </p>
          </div>
        </div>

        {/* Second Section */}
        <div className="flex flex-col w-full md:w-1/3">
          <div className="h-64 flex flex-col grow justify-center items-center px-2 md:px-4 py-3 w-full bg-quokka-yellow rounded-lg border-black border-solid border-[2px] md:border-[3px]">
            <Image src="/icons/item1-2.svg" alt="Quokka Save" width={138} height={128} />
          </div>
          {/* </div> */}
          <div className="h-24 md:h-56 grow mt-2 px-2 md:px-4 w-full text-xl md:text-2xl tracking-tighter leading-8 text-center text-black bg-white rounded-lg border-quokka-yellow border-solid border-[2px] md:border-[3px] font-[596]">
            <p className="py-4 md:py-6 my-2">
              We find and recommend the best experiences and negotiate special deals for our users.
            </p>
          </div>
        </div>

        {/* Third Section */}
        <div className="flex flex-col w-full md:w-1/3">
          <div className="h-64 flex flex-col grow justify-center items-center px-2 md:px-4 py-3 w-full bg-quokka-purple rounded-lg border-black border-solid border-[2px] md:border-[3px]">
            <Image src="/icons/item1-3.svg" alt="Quokka Party" width={138} height={128} />
          </div>
          <div className="h-24 md:h-56 grow mt-2 px-2 md:px-4 w-full text-xl md:text-2xl tracking-tighter leading-8 text-center text-black bg-white rounded-lg border-quokka-purple border-solid border-[2px] md:border-[3px] font-[596]">
            <p className="py-4 md:py-6 my-2">
              No endless lists or overwhelming choices, just hand-picked options that you&#39;ll
              love.
            </p>
          </div>
        </div>

        {/* First Text Section */}
        {/* <div className="flex flex-col w-full">
          <div className="grow px-2 md:px-4 py-2 md:py-6 w-full text-base md:text-2xl tracking-tighter leading-4 md:leading-8 text-center text-black bg-white rounded-lg border-quokka-green border-solid border-[2px] md:border-[3px] font-[596]">
            A smart guide to your city that personalises to your interests
          </div>
        </div> */}

        {/* Second Text Section */}
        {/* <div className="flex flex-col w-full">
          <div className="grow px-2 md:px-4 py-2 md:py-6 w-full text-base md:text-2xl tracking-tighter leading-4 md:leading-8 text-center text-black bg-white rounded-lg border-quokka-yellow border-solid border-[2px] md:border-[3px] font-[596]">
            We find and recommend the best experiences and negotiate special deals for our users.
          </div>
        </div> */}

        {/* Third Text Section */}
        {/* <div className="flex flex-col w-full">
          <div className="grow px-2 md:px-4 py-2 md:py-6 w-full text-base md:text-2xl tracking-tighter leading-4 md:leading-8 text-center text-black bg-white rounded-lg border-quokka-purple border-solid border-[2px] md:border-[3px] font-[596]">
            No endless lists or overwhelming choices, just hand-picked options that you&#39;ll love.
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default WhoAreWe
