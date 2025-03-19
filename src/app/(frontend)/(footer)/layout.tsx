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
        <div className="flex">
            <SideBar />
            {children}
        </div>
      </body>
    </html>
  )
}