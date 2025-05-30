import { HeaderClient } from './Component.client'
import React from 'react'

import type { Header } from '@/payload-types'

export async function Header() {
  return <HeaderClient />
}
