import React from 'react'
import Image from 'next/image'

const CustomLogo: React.FC = () => {
  return <Image src="/logo.svg" alt="City Quokka" className="h-8 w-auto" width={400} height={30}  />
}

export default CustomLogo
