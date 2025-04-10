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
              <li>
                <a href="https://www.xiaohongshu.com/user/profile/67c526b9000000000e01f932?xsec_token=YBDJR1Luk07NjoZGLEoo0Vzl6VTdDjn3vrejWu7V4MLB4=&xsec_source=app_share&xhsshare=CopyLink&appuid=5dec55ca0000000001003a47&apptime=1744258614&share_id=1610aa6754134891a67e02cd5a072bc4" target="_blank" rel="noopener noreferrer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 270 270"
                  >
                    <path
                      fill="currentColor"
                      d="m29 0.33333c-15.04 3.1333-27.464 14.871-29 30.667-1.5861 16.314 0 33.598 0 50v102c0 18.76-4.737 44.199 7.3333 60 13.039 17.069 36.823 13 55.667 13h146c5.7828 0 12.332 0.84741 18-0.33333 15.04-3.1334 27.464-14.871 29-30.667 1.5861-16.314 0-33.598 0-50v-102c0-18.76 4.737-44.199-7.3333-60-13.039-17.069-36.823-13-55.667-13h-146c-5.7828 0-12.332-0.84741-18 0.33333m91 90.667-7 19h12l-10 24 9 1c-0.98794 2.6816-2.3172 7.7332-4.3333 9.8333-1.4772 1.5388-3.7401 1.1667-5.6667 1.1667-4.3594 0-13.168 1.8054-15.5-3-1.0697-2.2042 0.46555-4.9845 1.3333-7 1.8136-4.2123 4.2226-8.5155 5.1667-13-2.1755 0-4.9246 0.42967-7-0.33333-7.7785-2.8597 0.87403-15.364 2.6667-19.667 1.2588-3.021 2.7565-9.5847 5.5-11.5 3.8521-2.6892 9.7166-0.82501 13.833-0.5m-79 63c2.7507 0 6.8374 0.81721 8.5-2 1.769-2.9975 0.5-9.5896 0.5-13v-33c0-3.0934-1.5618-12.536 1.1667-14.5 2.244-1.6157 11.666-1.2738 12.667 1.5 1.6373 4.5398 0.16667 12.162 0.16667 17v32c0 5.4839 0.94911 11.864-1.3333 17-2.1772 4.8986-12.303 9.2724-17.333 5.5-2.2132-1.6599-3.788-7.9099-4.3333-10.5m152-63v5c3.7289 0 8.4108-0.76337 12 0.33333 11.976 3.6594 11 15.423 11 25.667 1.9971 0 4.0442-0.15562 6 0.33333 11.493 2.8733 10 14.364 10 23.667 0 4.9562 0.93086 10.822-2.3333 15-3.5957 4.6025-9.482 4-14.667 4-1.6116 0-4.2632 0.51051-5.6667-0.5-2.6233-1.8888-3.7816-7.5048-4.3333-10.5 3.2871 0 9.2179 1.1252 11.833-1.3333 3.0831-2.8981 1.8208-14.232-1.8333-16.167-1.9366-1.0253-4.8867-0.5-7-0.5h-15v29h-14v-29h-14v-14h14v-12h-9v-14h9v-5h14m-32 5v14h-8v42h13v13h-46l5.3333-12.5 12.667-0.5v-42h-8v-14h31m57 14c0-2.842-0.51608-6.2587 0.33333-9 3.3443-10.793 19.616-2.094 11.5 6.8333-0.92279 1.0151-2.5442 1.5111-3.8333 1.8333-2.5605 0.64012-5.3801 0.33333-8 0.33333m-177 0-4.1667 37-6.8333 12-6-16 3-33h14m46 0 3 33-6 15h-2c-5.3669-8.4976-6.0533-17.263-7-27-0.6722-6.9141-2-14.04-2-21h14m106 0v12h9v-12h-9m-75 42-5 13h-22l5.3333-13.5 7.6667 0.16666z"
                    />
                  </svg>
                </a>
              </li>
            </ul>
            {/* Acknowledge of the country */}
            <h2 className="text-1xl font-bold mb-4 pr-5">Acknowledgement of Country</h2>
            <p className="mb-4 pr-20">
              We acknowledge the traditional custodians of the land on which we live, work and play,
              and pay respects to all elders past, present and
              emerging.
            </p>
          </div>
          <div className="flex flex-col w-full md:w-1/4">
            <h2 className="text-2xl font-bold mb-4">Explore</h2>
            <ul>
              <li>
                <Link href="/about-us" className="hover:underline duration-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:underline duration-500">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col w-full md:w-1/4">
            <h2 className="text-2xl font-bold mb-4">Learn More</h2>
            <ul>
            <li>
                <Link href="/cookies" className="hover:underline duration-500">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" className="hover:underline duration-500">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:underline duration-500">
                  Privacy Policy
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
