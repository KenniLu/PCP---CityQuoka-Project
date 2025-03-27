import React from 'react'
// import HomeNavBar from '@/components/HomeNavBar'
import { CityGuideNavBar } from '@/components/CityGuideNavBar'
import Footer from '@/components/Footer'

export default async function CityGuideLayout({ children }: { children: React.ReactNode }) {
  return(<div className="w-full">
    {/* <HomeNavBar /> */}
    <CityGuideNavBar/>
    {children}
    <Footer/>
  </div>)
}