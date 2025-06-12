'use client'

import React, { useEffect } from 'react'

export type RemoveDarkModeProviderProps = {
  children: React.ReactNode[]
}

const RemoveDarkModeProvider: React.FC<RemoveDarkModeProviderProps> = (props) => {
  useEffect(() => {
    const html = document.getElementsByTagName('html')[0]
    // Function to handle attribute changes
    const handleChange = (mutationsList): void => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme')
          if (newTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light')
          }
        }
      }
    }

    // Creating an observer instance
    const observer = new MutationObserver(handleChange)

    // Options for the observer (which attributes to watch)
    const config = { attributes: true }

    // Start observing the target node for configured mutations
    observer.observe(document.documentElement, config)

    html.setAttribute('data-theme', 'light')

    // Cleanup function to disconnect the observer
    return () => {
      observer.disconnect()
    }
  }, [])
  return <>{props.children}</>
}

export default RemoveDarkModeProvider;