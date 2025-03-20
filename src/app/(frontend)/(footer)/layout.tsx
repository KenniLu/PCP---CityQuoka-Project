import React from 'react'
import SideBar from './SideBar/page'

export default async function FooterLayout({children}: {children: React.ReactNode }) {

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>

      </head>
      <body>
      <div className="container mx-auto px-10 relative w-full pt-10 py-12">
          <div className="flex justify-between flex-col md:flex-row gap-4 w-full">
              <div className="flex flex-col flex-none">
                <SideBar />
              </div>
              <div className="flex flex-col md:w-4/5 flex-grow">
                {children}
              </div>
            </div>
        </div>
      </body>
    </html>
  )
}