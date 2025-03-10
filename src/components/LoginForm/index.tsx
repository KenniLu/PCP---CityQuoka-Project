'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { loginSchema, LoginFormValues } from '@/validationSchemas/loginSchema'
import { signIn } from 'next-auth/react'

import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {},
  })

  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
  const emailChanged = watch('email');
  const passwordChanged = watch('password');

  useEffect(() => {
    setErrorMessage('')
  },[emailChanged, passwordChanged])

  const onSubmit = async (data: LoginFormValues) => {
    const { email, password } = data
    try {
      const response = await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      if (response?.error) {
        setErrorMessage('Invalid email or password. Please try again.')
      }else{
        router.push("/")
      }
    } catch (error) {
      setErrorMessage('Invalid email or password. Please try again.')
    }
  }

  return (
    <div className="flex flex-col max-w-md mx-auto p-6 bg-white rounded-xl my-4">
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
                  peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2
                  peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1`}
              >
                Email
              </label>
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm text-left mb-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-3">
            <div className="relative">
              <input
                {...register('password')}
                type="password"
                id="password"
                placeholder=" "
                // className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500 peer"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500 focus:ring-blue-500 peer"
              />
              <label
                htmlFor="password"
                // className={`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 duration-150 peer-focus:text-sm peer-focus:-top-3 peer-focus:left-2 peer-focus:text-black peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2`}
                className={`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 duration-150
                  peer-focus:text-sm peer-focus:-top-0 peer-focus:left-2 peer-focus:text-blue-500
                  peer-focus:bg-white peer-focus:px-1
                  peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2
                  peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1`}
              >
                Password
              </label>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm text-left mb-1">{errors.password.message}</p>
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
            Login
          </button>
        </div>
      </form>
    </div>
  )
}
