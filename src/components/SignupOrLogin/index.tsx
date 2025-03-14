'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import LoginForm from '../LoginForm'
import RegisterForm from '../RegisterForm'
import { useSession } from 'next-auth/react'
import { Mail } from 'lucide-react'
import { signIn } from 'next-auth/react'
import EmailForm from '../EmailForm'

const SignUpOrLogIn = () => {
  const { data: session } = useSession()
  const [currentForm, setCurrentForm] = useState('login')
  const [showEmailInput, setShowEmailInput] = useState(false)

  if (session?.user) {
    return null
  }
  return (
    <div className="px-4" id="signup-or-login">
      <div className="relative bg-quokka-yellow w-full max-w-[1122px] mx-auto rounded-3xl px-4 pt-10 pb-10 text-center">
        {/* Top floating button */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <button className="w-[235px] h-[48px] flex-shrink-0 rounded-lg border-4 border-white border-solid bg-black text-quokka-yellow font-bold text-base">
            SIGN UP / LOG-IN
          </button>
        </div>

        {/* Main content */}
        <h2 className="text-black text-2xl leading-snug px-4 sm:px-[90px] font-medium mb-2">
          Unlock Your Sydney!
        </h2>

        <h3 className="text-black">
          Log in to get personalised recommendations, save your favourites,
        </h3>
        <h3 className="text-black">
          and be the first to know about upcoming events, special offers, and more..
        </h3>

        {currentForm === 'login' && (
          <>
            <LoginForm />
            <h3 className="text-black">
              Don&#39;t have an account?
              <a
                href="#"
                className="text-blue-500 hover:underline mx-1"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentForm('register')
                }}
              >
                Sign up now
              </a>
              for your tailored guide to new experiences
            </h3>
          </>
        )}
        {currentForm === 'register' && (
          <>
            <RegisterForm setLoginView={() => setCurrentForm('login')} />
            <h3 className="text-black">
              Already have an account?
              <a
                href="#"
                className="text-blue-500 hover:underline mx-1"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentForm('login')
                }}
              >
                Login
              </a>
              for your tailored guide to new experiences
            </h3>
          </>
        )}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300"></span>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-quokka-yellow text-gray-600 my-1">OR</span>
          </div>
        </div>
        <div className="flex flex-col w-full max-w-md space-y-2 p-2 mx-auto">
          {!showEmailInput ? (
            <button
              className="flex items-center pl-4 gap-4 w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-2 px-4 rounded-[4px] transition-colors"
              onClick={() => setShowEmailInput(true)}
            >
              <Mail size={20} className="flex-shrink-0" />
              <span>Login with Email</span>
            </button>
          ) : (
            <EmailForm />
          )}

          <button
            className="flex items-center pl-4 gap-4 w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-2 px-4 rounded-[4px] transition-colors"
            onClick={() => signIn('google')}
          >
            <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
            <span>Login with Google</span>
          </button>

          {/* <button className="flex items-center pl-4 gap-4 w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-2 px-4 rounded-[4px] transition-colors">
            <Image src="/icons/facebook.svg" alt="Facebook" width={20} height={20} />
            <span>Login with Facebook</span>
          </button> */}

          {/* <button className="flex items-center pl-4 gap-4 w-full bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-md transition-colors">
            <Apple size={20} />
            <span>Login with Apple</span>
          </button> */}
        </div>
      </div>
    </div>
  )
}

export default SignUpOrLogIn
