'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { emailSchema, EmailFormValues } from '@/validationSchemas/emailSchema'
import { signIn } from 'next-auth/react'

import { Alert, AlertDescription } from '@/components/ui/alert'

export default function EmailForm() {
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
      const response = await signIn('nodemailer', {
        email,
      })
      // if (response?.error) {
      //   setErrorMessage('Invalid email or password. Please try again.')
      // }else{
      //   router.push("/")
      // }
    } catch (error) {
      setErrorMessage('Invalid email. Please try again.')
    }
  }

  return (
    <div>
      <form className="flex w-full gap-1">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"> */}
        <input
          {...register('email')}
          type="text"
          id="email"
          placeholder="Enter email address"
          className="flex-grow flex-1 min-w-0 py-2 px-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button
          type="button"
          className={`shrink-0 w-auto px-4 py-2 rounded-md ${isValid ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          onClick={handleSubmit(onSubmit)}
        >
          Login
        </button>
      </form>
      {errors.email && (
        <p className="text-red-500 text-sm text-left mb-1">{errors.email.message}</p>
      )}
    </div>
  )
}
