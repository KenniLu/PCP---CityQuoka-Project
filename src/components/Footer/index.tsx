import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer>
      <div className="container mx-auto px-10 text-white relative w-full max-w-[1122px] pt-10 bg-black py-12">
        <div className="flex justify-between flex-col md:flex-row gap-4 w-full">
          <div className="flex flex-col w-full md:w-1/2">
            {/* <h2 className="text-2xl font-bold mb-4">Logo</h2> */}
            <Link href="/">
              {/* <Image src="/icons/item1-1.svg" alt="Quokka Map" width={138} height={128} /> */}
              <Image
                className="filter invert w-40 pb-7"
                src="/city-quokka-label.png"
                alt="logo"
                width={144}
                height={40}
              />
            </Link>
            {/* Media */}
            <ul className="flex space-x-4 text-4xl pb-5">
              <li>
                <a href="https://www.instagram.com/cityquokka" target="_blank" rel="noopener noreferrer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="currentColor"
                      d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@cityquokka" target="_blank" rel="noopener noreferrer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-9 h-9"
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="currentColor"
                      d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"
                    />
                  </svg>
                </a>
              </li>
            </ul>
            {/* Acknowledge of the country */}
            <h2 className="text-1xl font-bold mb-4 pr-5">Acknowledgement of the Country</h2>
            <p className="mb-4 pr-20">
              We acknowledge the traditional custodians of the land on which we live, work and play,
              and pay respects to the 29 clans of the Eora Nation and all Elders past, present and
              emerging.
            </p>
          </div>
          <div className="flex flex-col w-full md:w-1/4">
            <h2 className="text-2xl font-bold mb-4">Explore</h2>
            <ul>
              <li>
                <Link href="/about-us" className="hover:underline duration-500">
                  About us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline duration-500">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col w-full md:w-1/4">
            <h2 className="text-2xl font-bold mb-4">Learn More</h2>
            <ul>
              <li>
                <Link href="#" className="hover:underline duration-500">
                  Term of use
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline duration-500">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline duration-500">
                  Private Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-zinc-50 mt-10">@ Copyright 2025 by City Quokka</p>
      </div>
    </footer>
  )
}

export default Footer
