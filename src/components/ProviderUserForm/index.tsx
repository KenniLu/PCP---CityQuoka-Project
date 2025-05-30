'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  providerUserRegisterSchema,
  ProviderUserRegisterFormValues,
} from '@/validationSchemas/providerUserRegisterSchema'

// import Link from 'next/link'

// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export type ProviderUserFormProps = {
  defaultValues: ProviderUserRegisterFormValues
  submitUserInfo: (values: ProviderUserRegisterFormValues) => void
}

const ProviderUserForm: React.FC<ProviderUserFormProps> = ({ defaultValues, submitUserInfo }) => {
  // const [isSubmitting, setIsSubmitting] = useState(false)
  // const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    // control,
    // watch,
    // reset,
    formState: { errors },
  } = useForm<ProviderUserRegisterFormValues>({
    resolver: zodResolver(providerUserRegisterSchema),
    defaultValues,
  })

  const submit = async (data: ProviderUserRegisterFormValues) => {
    // setIsSubmitting(true)
    try {
      submitUserInfo(data)
      // setSubmitSuccess(true)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      // setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg my-6">
      <h2 className="text-xl font-bold mb-6">
        To get started, Please fill the below form to create your account
      </h2>
      <form onSubmit={handleSubmit(submit)}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full min-w-0 py-2 px-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="text"
              {...register('email')}
              className="w-full min-w-0 py-2 px-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full min-w-0 py-2 px-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Confirmation
            </label>
            <input
              type="password"
              {...register('passwordConfirmation')}
              className="w-full min-w-0 py-2 px-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.passwordConfirmation && (
              <p className="mt-1 text-sm text-red-600">{errors.passwordConfirmation.message}</p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="submit"
              // onClick={handleNext}
              className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Next
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProviderUserForm
