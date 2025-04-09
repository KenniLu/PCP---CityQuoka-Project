'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import LoginForm from '../LoginForm'
import RegisterForm from '../RegisterForm'
import ForgotPasswordForm from '../ForgotPasswordForm'
import { Mail } from 'lucide-react'
import { signIn } from 'next-auth/react'
import EmailForm from '../EmailForm'

type SignUpOrLogInProps = {
  children: React.ReactNode
  onSuccessfulLogin?: () => void
}

const SignUpOrLogIn: React.FC<SignUpOrLogInProps> = ({ children, onSuccessfulLogin }) => {
  const [currentForm, setCurrentForm] = useState('login')
  const [showEmailInput, setShowEmailInput] = useState(false)

  return (
    <>
      {children}
      {currentForm === 'login' && (
        <>
          <LoginForm onSuccessfulLogin={onSuccessfulLogin}>
            <a
              href="#"
              className="text-blue-500 hover:underline mx-1 mt-1"
              onClick={(e) => {
                e.preventDefault()
                setCurrentForm('forgot')
              }}
            >
              Forgot password?
            </a>
          </LoginForm>
          <h3 className="text-black">
            Don&#39;t have an account?
            <a
              href="#"
              className="text-blue-500 hover:underline mx-1"
              onClick={(e) => {
                e.preventDefault()
                setCurrentForm('forgot')
              }}
            >
              Sign up now
            </a>
            for your tailored guide to new experiences
          </h3>
        </>
      )}
      {currentForm === 'forgot' && (
        <>
          <ForgotPasswordForm>
            <a
              href="#"
              className="text-blue-500 hover:underline mx-1 mt-1"
              onClick={(e) => {
                e.preventDefault()
                setCurrentForm('login')
              }}
            >
              Back to Login
            </a>
          </ForgotPasswordForm>
          <h3 className="text-black">
            Don&#39;t have an account?
            <a
              href="#"
              className="text-blue-500 hover:underline mx-1"
              onClick={(e) => {
                e.preventDefault()
                setCurrentForm('login')
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
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300"></span>
        </div>
        <div className="relative flex justify-center">
          <span className="px-2 bg-quokka-yellow text-gray-600">OR</span>
        </div>
      </div>
      <div className="flex flex-col w-full max-w-md space-y-2 mx-auto">
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
    </>
  )
}

export default SignUpOrLogIn
