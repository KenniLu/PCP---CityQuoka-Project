'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { providerInfoSchema, ProviderInfoFormValues } from '@/validationSchemas/providerInfoSchema'

export type ProviderInfoFormProps = {
  defaultValues: ProviderInfoFormValues
  submitProviderInfo: (values: ProviderInfoFormValues) => void
  handleBack: () => void
}

const ProviderInfoForm: React.FC<ProviderInfoFormProps> = ({ defaultValues, submitProviderInfo, handleBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProviderInfoFormValues>({
    resolver: zodResolver(providerInfoSchema),
    defaultValues,
  })

  const submit = async (data: ProviderInfoFormValues) => {
    try {
      submitProviderInfo(data)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg my-6">
      <h2 className="text-xl font-bold mb-6">
        Please provide the below details about your business
      </h2>
      <form onSubmit={handleSubmit(submit)}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full min-w-0 py-2 px-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              {...register('phone')}
              className="w-full min-w-0 py-2 px-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Please describe your business in a few words</label>
            <textarea
              {...register('description')}
              className="w-full min-w-0 py-2 px-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Previous
            </button>
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

export default ProviderInfoForm
