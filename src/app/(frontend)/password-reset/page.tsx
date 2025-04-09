'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'
import { validateToken } from '@/app/actions/auth'
import PasswordResetForm from '@/components/PasswordResetForm'

type TokenStatus = 'loading' | 'valid' | 'invalid'

export default function PasswordResetPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>('loading')

  // Redirect to home if no token is provided
  useEffect(() => {
    if (!token) {
      router.push('/')
      return
    }
    const validateTokenCheck = async () => {
      try {
        const tokenValid = await validateToken(token)
        setTokenStatus(tokenValid ? 'valid' : 'invalid')
      } catch (err) {
        setTokenStatus('invalid')
      }
    }
    validateTokenCheck()
  }, [token, router])

  if (tokenStatus === 'loading') {
    return (
      <a>Verifying Token ...</a>
    )
  }

  if (tokenStatus === 'invalid') {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center max-h-80 max-w-[1122px] mx-auto px-2">
        <Alert variant="default" className="my-2">
          <AlertTitle className="text-xl">Invalid Link</AlertTitle>
          <AlertDescription className="text-base">
            <p>
              This link is invalid or has expired. Please request a new link to retry this
              operation.
            </p>
          </AlertDescription>
        </Alert>

        <Link
          href="/"
          className={`w-64 p-2 rounded-md bg-quokka-yellow hover:bg-[#E69D00] mx-auto text-center inline-block`}
        >
          Back to Home
        </Link>
      </div>
    )
  }

  return <PasswordResetForm token={token!} />
}
