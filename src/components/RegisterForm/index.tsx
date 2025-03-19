'use client'

import React, { useState } from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { registerSchema, RegisterFormValues } from '@/validationSchemas/registerSchema'
import { registerUser } from '@/app/actions/auth'
import { AlertTriangleIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export type RegisterFormProps = {
  setLoginView: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ setLoginView }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid }, //, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {},
  })

  const [errorMessage, setErrorMessage] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const { success, error, errors } = await registerUser(data)
      if (errors) {
        errors.forEach((error) => {
          setError(error.path as keyof RegisterFormValues, {
            type: 'server',
            message: error.message,
          })
        })
      } else if (error) {
        setErrorMessage(error)
      }
      if (success) {
        setShowSuccessMessage(true)
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Something went wrong. Please try again!')
      }
    }
  }

  const successMessage = () => (
    <>
      <Alert variant="default" className="my-2">
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription className="text-base">
          Account created successfully. Please
          <a
            href="#"
            className="text-blue-500 hover:underline mx-1"
            onClick={(e) => {
              e.preventDefault()
              setLoginView()
            }}
          >
            login
          </a>
          with your account
        </AlertDescription>
      </Alert>
    </>
  )

  const registerForm = () => (
    <div className="flex flex-col w-full max-w-md mx-auto p-2 bg-white rounded-xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"> */}
        <div>
          <div className="mb-3">
            <div className="relative">
              <input
                {...register('firstName')}
                type="text"
                id="firstName"
                placeholder=" "
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500 focus:ring-blue-500 peer"
              />
              <label
                htmlFor="firstName"
                className={`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 duration-150
              peer-focus:text-sm peer-focus:-top-0 peer-focus:left-2 peer-focus:text-blue-500
              peer-focus:bg-white peer-focus:px-1
              peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2
              peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1`}
              >
                First Name
              </label>
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-sm text-left mb-1">{errors.firstName.message}</p>
            )}
          </div>

          <div className="mb-3">
            <div className="relative">
              <input
                {...register('lastName')}
                type="text"
                id="lastName"
                placeholder=" "
                // className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500 peer"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500 focus:ring-blue-500 peer"
              />
              <label
                htmlFor="lastName"
                // className={`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 duration-150 peer-focus:text-sm peer-focus:-top-3 peer-focus:left-2 peer-focus:text-black peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2`}
                className={`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 duration-150
              peer-focus:text-sm peer-focus:-top-0 peer-focus:left-2 peer-focus:text-blue-500
              peer-focus:bg-white peer-focus:px-1
              peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2
              peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1`}
              >
                Last Name
              </label>
            </div>
            {errors.lastName && (
              <p className="text-red-500 text-sm text-left mb-1">{errors.lastName.message}</p>
            )}
          </div>

          <div className="mb-3">
            <div className="relative">
              <input
                {...register('email')}
                type="text"
                id="email"
                placeholder=" "
                // className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500 peer"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500 focus:ring-blue-500 peer"
              />
              <label
                htmlFor="email"
                // className={`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 duration-150 peer-focus:text-sm peer-focus:-top-3 peer-focus:left-2 peer-focus:text-black peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2`}
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
              <p className="text-red-500 text-sm text-left  mb-1">{errors.password.message}</p>
            )}
          </div>

          <div className="mb-3">
            <div className="relative">
              <input
                {...register('passwordConfirmation')}
                type="password"
                id="passwordConfirmation"
                placeholder=" "
                // className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500 peer"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500 focus:ring-blue-500 peer"
              />
              <label
                htmlFor="passwordConfirmation"
                // className={`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 duration-150 peer-focus:text-sm peer-focus:-top-3 peer-focus:left-2 peer-focus:text-black peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2`}
                className={`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 duration-150
              peer-focus:text-sm peer-focus:-top-0 peer-focus:left-2 peer-focus:text-blue-500
              peer-focus:bg-white peer-focus:px-1
              peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2
              peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1`}
              >
                Password Confirmation
              </label>
            </div>
            {errors.passwordConfirmation && (
              <p className="text-red-500 text-sm text-left mb-1">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>
        </div>
        {errorMessage !== '' && (
          <Alert variant="destructive" className="my-2">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <div className="item-center flex justify-center">
          <button
            type="submit"
            className={`w-64 p-2 rounded-md ${isValid ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <>
      {showSuccessMessage ? successMessage() : registerForm()}
    </>
  )
}

export default RegisterForm
