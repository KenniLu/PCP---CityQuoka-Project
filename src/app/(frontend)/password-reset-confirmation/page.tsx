'use client'

import { useSearchParams } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'

enum Error {
  Configuration = 'Configuration',
  OAuthAccountNotLinked = 'OAuthAccountNotLinked',
}

const errorMap = {
  [Error.Configuration]: (
    <>
      <p>
        There was a problem when trying to authenticate. Please contact us if this error persists.
      </p>
      <p>
        Unique error code:{' '}
        <code className="rounded-sm bg-slate-100 p-1 text-base">Configuration</code>
      </p>
    </>
  ),
  [Error.OAuthAccountNotLinked]: (
    <>
      <p>
        An account is already registered for this email address. Please login with your email and
        password.
      </p>
    </>
  ),
}

export default function PasswordResetConfirmationPage() {
  const search = useSearchParams()
  const error = search.get('error') as Error

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center max-h-80 max-w-[1122px] mx-auto px-2">
      {/* <a
        href="#"
        className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Something went wrong
        </h5>
        <div className="font-normal text-gray-700 dark:text-gray-400">
          {errorMap[error] || "Please contact us if this error persists."}
        </div>
      </a> */}
      <Alert variant="default" className="my-2">
        <AlertTitle className="text-xl">Please check your email</AlertTitle>
        <AlertDescription className="text-base">
          <p>
            A password reset link will be sent to your email address if an account exists for the
            email
          </p>
          <p>The link is valid for 1 hour.</p>
        </AlertDescription>
      </Alert>

      <Link href="/" className={`w-64 p-2 rounded-md bg-quokka-yellow hover:bg-[#E69D00] mx-auto text-center inline-block`}>
        Back to Home
      </Link>
    </div>
  )
}
