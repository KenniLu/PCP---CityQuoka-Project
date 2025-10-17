'use client';

import Link from 'next/link';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';

interface UserProfile {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

const emptyProfile: UserProfile = {
  firstName: '',
  lastName: '',
  mobileNumber: '',
  email: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
};

const normaliseProfile = (profile?: Partial<UserProfile> | null): UserProfile => ({
  firstName: profile?.firstName ?? '',
  lastName: profile?.lastName ?? '',
  mobileNumber: profile?.mobileNumber ?? '',
  email: profile?.email ?? '',
  address: profile?.address ?? '',
  city: profile?.city ?? '',
  state: profile?.state ?? '',
  postalCode: profile?.postalCode ?? '',
});

export default function MyProfile() {
  const [formData, setFormData] = useState<UserProfile>(emptyProfile);
  const [initialData, setInitialData] = useState<UserProfile>(emptyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/profile', {
          credentials: 'include',
          signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const message = (data as { error?: string })?.error || 'Unable to load your profile.';
          throw new Error(message);
        }

        const profile = normaliseProfile((data as { profile?: Partial<UserProfile> }).profile);
        setFormData(profile);
        setInitialData({ ...profile });
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        const message =
          fetchError instanceof Error ? fetchError.message : 'Unable to load your profile.';
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => controller.abort();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setStatusMessage(null);
    setError(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setStatusMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const details = (data as { details?: Record<string, string[]> }).details;
        const validationMessages = details ? Object.values(details).flat() : [];
        const message =
          validationMessages[0] || (data as { error?: string })?.error ||
          'We could not save your changes. Please try again.';
        throw new Error(message);
      }

      const profile = normaliseProfile((data as { profile?: Partial<UserProfile> }).profile);
      setFormData(profile);
      setInitialData({ ...profile });
      setIsEditing(false);
      setStatusMessage('Changes saved successfully.');
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : 'We could not save your changes. Please try again.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...initialData });
    setIsEditing(false);
    setStatusMessage(null);
    setError(null);
  };

  const startEditing = () => {
    if (isLoading) return;
    setIsEditing(true);
    setStatusMessage(null);
    setError(null);
  };

  const disableInputs = !isEditing || isSaving;

  return (
    <div className="w-full">
      {/* 🔶 Top orange buttons */}
      <div className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-center items-center h-16">
          <div className="flex items-center gap-6">
            <Link
              href="/account/profile"
              className="px-6 py-2 rounded-full bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition"
            >
              My Profile
            </Link>
            <Link
              href="/my-sydney"
              className="px-6 py-2 rounded-full bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition"
            >
              My Sydney
            </Link>
            <Link
              href="/offers"
              className="px-6 py-2 rounded-full bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition"
            >
              My Offer
            </Link>
          </div>
        </div>
      </div>

      {/* 🔹 Blue info bar + form */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-blue-100">Manage your personal information</p>
          </div>

          <form onSubmit={handleSave} className="p-6">
            {(statusMessage || error) && (
              <div className="mb-6">
                {statusMessage && (
                  <p className="rounded-lg bg-green-100 text-green-700 px-4 py-2 text-sm" role="status">
                    {statusMessage}
                  </p>
                )}
                {error && (
                  <p className="rounded-lg bg-red-100 text-red-700 px-4 py-2 text-sm" role="alert">
                    {error}
                  </p>
                )}
              </div>
            )}

            {isLoading && (
              <p className="mb-6 text-sm text-gray-500">Loading your profile...</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500">A</span>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={disableInputs}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500">A</span>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={disableInputs}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500">Q</span>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    disabled={disableInputs}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500">☒</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={disableInputs}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500">☺</span>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={disableInputs}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                    required
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500">☺</span>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={disableInputs}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                    required
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500">☺</span>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={disableInputs}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                    required
                  />
                </div>
              </div>

              {/* Postal Code */}
              <div className="md:col-span-2">
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500">☺</span>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    disabled={disableInputs}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Edit / Save Buttons */}
            <div className="mt-8 flex justify-end">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={startEditing}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Edit
                </button>
              ) : (
                <div className="space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
