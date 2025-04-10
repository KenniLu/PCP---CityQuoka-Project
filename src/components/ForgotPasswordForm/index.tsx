'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { emailSchema, EmailFormValues } from '@/validationSchemas/emailSchema'
// import { signIn } from 'next-auth/react'
import { forgotPassword } from '@/app/actions/auth'

import { Alert, AlertDescription } from '@/components/ui/alert'

interface ForgotPasswordFormProps {
  children: React.ReactNode
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ children }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
    defaultValues: {},
  })

  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
  const emailChanged = watch('email')
  
  useEffect(() => {
    setErrorMessage('')
  }, [emailChanged])

  const onSubmit = async (data: EmailFormValues) => {
    const { email } = data
    try {
      const response = await forgotPassword({email})
      router.push('/password-reset-confirmation');
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again')
    }
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto p-2 bg-white rounded-xl">
      <a className="my-2">Enter your email below to receive a password reset link</a>
      <form>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"> */}
        <div>
          <div className="mb-3">
            <div className="relative">
              <input
                {...register('email')}
                type="text"
                id="email"
                placeholder=" "
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500 focus:ring-blue-500 peer"
              />
              <label
                htmlFor="email"
                className={`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 duration-150
                  peer-focus:text-sm peer-focus:-top-0 peer-focus:left-2 peer-focus:text-blue-500
                  peer-focus:bg-white peer-focus:px-1
                  peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-0
                  peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1`}
              >
                Email
              </label>
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm text-left mb-1">{errors.email.message}</p>
            )}
          </div>
        </div>
        {errorMessage !== '' && (
          <Alert variant="destructive" className="my-2">
            <AlertDescription className="text-base">{errorMessage}</AlertDescription>
          </Alert>
        )}
        <div className="item-center flex justify-center">
          <button
            type="button"
            className={`w-64 p-2 rounded-md ${isValid ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </button>
        </div>
      </form>
      {children}
    </div>
  )
}

export default ForgotPasswordForm;