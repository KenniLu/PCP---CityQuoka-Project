'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  businessContactSchema,
  BusinessContactFormValues,
  reasonForContactOptions,
  businessTypeOptions,
} from '@/validationSchemas/businessContactSchema'

import sendBusinessContactEmail from '@/utilities/sendBusinessContactEmail'

import Link from 'next/link'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const BusinessContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<BusinessContactFormValues>({
    resolver: zodResolver(businessContactSchema),
    defaultValues: {
      reasonForContact: undefined,
      otherReason: '',
      businessName: '',
      typeOfBusiness: undefined,
      businessLocation: '',
      contactName: '',
      email: '',
      contactNumber: '',
    },
  })

  const reasonForContact = watch('reasonForContact')

  const onSubmit = async (data: BusinessContactFormValues) => {
    setIsSubmitting(true)
    try {
      await sendBusinessContactEmail(data)
      setSubmitSuccess(true)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-6">
      {submitSuccess ? (
        <Alert variant="default" className="my-2">
          <AlertTitle>Thank you for your interest!</AlertTitle>
          <AlertDescription className="text-base my-2">
            We&#39;ll get in touch with you shortly.
          </AlertDescription>
          <Link
            href="/"
            className="bg-quokka-yellow p-3 rounded-lg block w-40 mx-auto text-center"
          >
            Home
          </Link>
        </Alert>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-6">
            Please fill the below form. we&#39;ll get in touch with you shortly.{' '}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Reason for Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Contact *
                </label>
                <select
                  {...register('reasonForContact')}
                  // className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  className="w-full min-w-0 py-2 px-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a reason</option>
                  {reasonForContactOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.reasonForContact && (
                  <p className="mt-1 text-sm text-red-600">{errors.reasonForContact.message}</p>
                )}
              </div>

              {/* Other Reason - conditionally shown */}
              {reasonForContact === 'other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Please specify *
                  </label>
                  <textarea
                    {...register('otherReason')}
                    rows={3}
                    // className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    className="w-full min-w-0 py-2 px-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please specify your reason"
                  />
                  {errors.otherReason && (
                    <p className="mt-1 text-sm text-red-600">{errors.otherReason.message}</p>
                  )}
                </div>
              )}

              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  {...register('businessName')}
                  // className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  className="w-full min-w-0 py-2 px-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
                )}
              </div>

              {/* Type of Business */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Business *
                </label>
                <select
                  {...register('typeOfBusiness')}
                  // className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  className="w-full min-w-0 py-2 px-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a business type</option>
                  {businessTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.typeOfBusiness && (
                  <p className="mt-1 text-sm text-red-600">{errors.typeOfBusiness.message}</p>
                )}
              </div>

              {/* Business Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address *
                </label>
                <textarea
                  {...register('businessLocation')}
                  rows={3}
                  // className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  className="w-full min-w-0 py-2 px-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.businessLocation && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessLocation.message}</p>
                )}
              </div>

              {/* Contact Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name *
                </label>
                <input
                  type="text"
                  {...register('contactName')}
                  // className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  className="w-full min-w-0 py-2 px-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.contactName && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  {...register('email')}
                  // className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  className="w-full min-w-0 py-2 px-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  {...register('contactNumber')}
                  // className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  className="w-full min-w-0 py-2 px-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. +1 (555) 123-4567"
                />
                {errors.contactNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactNumber.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default BusinessContactForm
