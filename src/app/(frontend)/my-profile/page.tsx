'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import useSWR, {mutate as globalMutate } from 'swr';
import AppHeader from '@/components/AppHeader'; 

// Local type
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

export default function Page() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    firstName: 'Robin',
    lastName: 'Nguyen',
    mobileNumber: '0412345678',
    email: 'Huy@gmail.com',
    address: '2/79 Victoria Street',
    city: 'Dhaka',
    state: 'NSW',
    postalCode: '2121',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    console.log('Saved data:', formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: 'Robin',
      lastName: 'Nguyen',
      mobileNumber: '0412345678',
      email: 'Huy@gmail.com',
      address: '2/79 Victoria Street',
      city: 'Dhaka',
      state: 'NSW',
      postalCode: '2121',
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <AppHeader />

      {/* Profile Form */}
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-blue-100">Manage your personal information</p>
          </div>

          <form onSubmit={handleSave} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                  required
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                  required
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                  required
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                  required
                />
              </div>

              {/* Postal Code */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-end">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
              ) : (
                <div className="space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Changes
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
