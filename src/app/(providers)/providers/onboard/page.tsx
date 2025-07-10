'use client'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProviderUserRegisterFormValues } from '@/validationSchemas/providerUserRegisterSchema'
import { ProviderInfoFormValues } from '@/validationSchemas/providerInfoSchema'
import ProviderUserForm from '@/components/ProviderUserForm'
import ProviderInfoForm from '@/components/ProviderInfoForm'
import SocialLinksEditor from '@/components/SocialLinksEditor'
import { onboardProvider } from '@/app/actions/providers/onboard'
import Link from 'next/link'

type OnboardingFormData = {
  user: ProviderUserRegisterFormValues
  provider: ProviderInfoFormValues
}

const OnboardingPage = () => {
  
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [errorMessage, setErrorMessage] = useState('')

  const [formData, setFormData] = useState<OnboardingFormData>({
    user: {
      email: '',
      name: '',
      password: '',
      passwordConfirmation: '',
    },
    provider: {
      email: '',
      name: '',
      description: '',
      phone: '',
      socialLinks: [],
    },
  })

  const submitUserInfo = (data: ProviderUserRegisterFormValues) => {
    setFormData({ ...formData, user: data })
    handleNext()
  }

  const submitProviderInfo = (data: ProviderInfoFormValues) => {
    const providerInfo = { ...formData.provider, ...data }
    setFormData({ ...formData, provider: providerInfo })
    handleNext()
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    setCurrentStep(currentStep + 1)
  }

  const submitWithSocials = async (socialLinks: ProviderInfoFormValues['socialLinks']) => {
    const providerInfo = { ...formData.provider, socialLinks }
    setFormData({ ...formData, provider: providerInfo })
    const resp = await onboardProvider({ ...formData, provider: providerInfo })
    handleNext()
  }

  return (
    <div className="bg-gray-50 flex flex-col py-6 sm:px-6 lg:px-8 sm:w-[600px]">
      <div className="sm:mx-auto sm:w-full">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {currentStep === 1
            ? 'Create your account'
            : currentStep > 3
              ? 'Thank You!'
              : 'Tell us about your business'}
        </h2>
      </div>

      {currentStep > 3 ? (
        <div className="mx-auto mt-8 text-center">
          <p>Thanks for your interest in City Quokka</p>
          <p>We&#39;ll get in touch with you soon and guide you through the next steps.</p>
          <Link href="/">
            <button
              type="submit"
              className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 mt-8"
            >
              Home
            </button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 sm:mx-auto sm:w-full">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {/* Progress indicator */}
            <div className="mb-8 hidden sm:block">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center h-10 w-10 rounded-full ${
                      currentStep >= 1 ? 'bg-amber-500' : 'bg-gray-200'
                    } text-white font-medium`}
                  >
                    1
                  </div>
                  <div className="ml-4 text-sm font-medium text-gray-900">Account</div>
                </div>
                <div
                  className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-amber-500' : 'bg-gray-200'}`}
                ></div>
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center h-10 w-10 rounded-full ${
                      currentStep >= 2 ? 'bg-amber-500' : 'bg-gray-200'
                    } text-white font-medium`}
                  >
                    2
                  </div>
                  <div className="ml-4 text-sm font-medium text-gray-900">Business</div>
                </div>
                <div
                  className={`flex-1 h-1 mx-4 ${currentStep >= 3 ? 'bg-amber-500' : 'bg-gray-200'}`}
                ></div>
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center h-10 w-10 rounded-full ${
                      currentStep >= 3 ? 'bg-amber-500' : 'bg-gray-200'
                    } text-white font-medium`}
                  >
                    3
                  </div>
                  <div className="ml-4 text-sm font-medium text-gray-900">Social</div>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errorMessage}
              </div>
            )}

            {currentStep === 1 && (
              <ProviderUserForm defaultValues={formData.user} submitUserInfo={submitUserInfo} />
            )}
            {currentStep === 2 && (
              <ProviderInfoForm
                defaultValues={formData.provider}
                submitProviderInfo={submitProviderInfo}
                handleBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <SocialLinksEditor
                value={formData.provider.socialLinks}
                onSubmit={submitWithSocials}
                handleBack={handleBack}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default OnboardingPage
