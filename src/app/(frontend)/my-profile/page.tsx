'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { UserProfile } from '@/types/new-types';
import OfferFilter from '@/components/OfferFilter/page';
import Footer from '@/components/Footer';

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserProfile>({
    firstName: 'Robin',
    lastName: 'Nguyen',
    mobileNumber: '0412345678',
    email: 'Huy@gmail.com',
    address: '2/79 Victoria Street',
    city: 'Dhaka',
    state: 'NSW',
    postalCode: '2121'
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e: FormEvent): void => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically make an API call to save the data
    console.log('Saved data:', formData);
  };

  const handleCancel = (): void => {
    setIsEditing(false);
    // Reset form data to original values if needed
    setFormData({
      firstName: 'Robin',
      lastName: 'Nguyen',
      mobileNumber: '0412345678',
      email: 'Huy@gmail.com',
      address: '2/79 Victoria Street',
      city: 'Dhaka',
      state: 'NSW',
      postalCode: '2121'
    });
  };

  return (
    <div className="min-h-screen bg-[#FFBB63] p-6 rounded-3xl border-l-background border-black space-y-6 overflow-x-scroll scroll-smooth">
      <nav>
        <OfferFilter />
      </nav>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-blue-100">Manage your personal information</p>
        </div>

        <form onSubmit={handleSave} className="p-6">
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* Edit/Save Button */}
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
    
     <nav className = 'flex flex-colflex-grow-0'>
        <Footer />
      </nav>
    </div>
  );
}