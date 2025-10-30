'use client';
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import AppHeader from '@/components/AppHeader'; // ✅ use the global header

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

type FormErrors = Partial<Record<keyof UserProfile, string>>;

export default function Page() {
  // Pull `update` so we can refresh the session once the profile is saved.
  const { data: session, update: updateSession } = useSession();

  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [initialData, setInitialData] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Guard against state updates when the component unmounts mid-request.
    let isActive = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/profile', { cache: 'no-store' });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          const message =
            typeof payload?.error === 'string' ? payload.error : 'Failed to load profile';
          throw new Error(message);
        }

        const profile: UserProfile = await response.json();
        if (!isActive) return;
        setFormData(profile);
        setInitialData(profile);
      } catch (err) {
        if (!isActive) return;
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Keep the controlled inputs in sync with local state.
    const { name, value } = event.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData) return;

    setIsSaving(true);
    setSaveError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          typeof payload?.error === 'string' ? payload.error : 'Failed to update profile';
        throw new Error(message);
      }

      const updatedProfile = payload as UserProfile;
      setFormData(updatedProfile);
      setInitialData(updatedProfile);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully.');

      if (typeof updateSession === 'function' && session?.user?.id) {
        // Push the latest profile data into the NextAuth session token.
        await updateSession({
          user: {
            ...session.user,
            ...updatedProfile,
          },
        });
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Revert unsaved edits and exit edit mode.
    setIsEditing(false);
    setSaveError(null);
    setSuccessMessage(null);
    setFormData(initialData);
  };

  // Lock the form while not editing or while a save is in flight.
  const disableInputs = !isEditing || isSaving;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <AppHeader />

      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-blue-100">Manage your personal information</p>
          </div>

          <div className="p-6">
            {loading ? (
              <p className="text-gray-600">Loading profile...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : !formData ? (
              <p className="text-gray-600">No profile data available.</p>
            ) : (
              <form onSubmit={handleSave}>
                <div className="space-y-4 mb-6">
                  {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
                  {saveError && <p className="text-sm text-red-600">{saveError}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName ?? ''}
                      onChange={handleInputChange}
                      disabled={disableInputs}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName ?? ''}
                      onChange={handleInputChange}
                      disabled={disableInputs}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber ?? ''}
                      onChange={handleInputChange}
                      disabled={disableInputs}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email ?? ''}
                      onChange={handleInputChange}
                      disabled={disableInputs}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address ?? ''}
                      onChange={handleInputChange}
                      disabled={disableInputs}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city ?? ''}
                      onChange={handleInputChange}
                      disabled={disableInputs}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state ?? ''}
                      onChange={handleInputChange}
                      disabled={disableInputs}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode ?? ''}
                      onChange={handleInputChange}
                      disabled={disableInputs}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
                      required
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(true);
                        setSaveError(null);
                        setSuccessMessage(null);
                      }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isSaving}
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="space-x-4">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// 'use client';
// import React, { useState, ChangeEvent, FormEvent } from 'react';
// import useSWR, {mutate as globalMutate } from 'swr';
// import AppHeader from '@/components/AppHeader'; 

// // Local type
// interface UserProfile {
//   firstName: string;
//   lastName: string;
//   mobileNumber: string;
//   email: string;
//   address: string;
//   city: string;
//   state: string;
//   postalCode: string;
// }

// type FormErrors = Partial<Record<keyof UserProfile, string>>;

// export default function Page() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState<UserProfile>({
//     firstName: 'Robin',
//     lastName: 'Nguyen',
//     mobileNumber: '0412345678',
//     email: 'Huy@gmail.com',
//     address: '2/79 Victoria Street',
//     city: 'Dhaka',
//     state: 'NSW',
//     postalCode: '2121',
//   });

//   const isDigitsOnly = (v: string) => /^\d+$/.test(v);

//   const validate = () => {
//     const nextErrors: FormErrors = {};

//     // Rule: mobile must be numeric and at least 10 digits
//     if (!isDigitsOnly(formData.mobileNumber) || formData.mobileNumber.length < 10) {
//       nextErrors.mobileNumber = 'Mobile number must be numeric and at least 10 digits.';
//     }

//     // Rule: postal code must be numeric and exactly 4 digits
//     if (!isDigitsOnly(formData.postalCode) || formData.postalCode.length !== 4) {
//       nextErrors.postalCode = 'Postal code must be numeric and exactly 4 digits.';
//     }

//     setErrors(nextErrors);
//     return Object.keys(nextErrors).length === 0;
//   };

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSave = (e: FormEvent) => {
//     e.preventDefault();
//     setIsEditing(false);
//     console.log('Saved data:', formData);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setFormData({
//       firstName: 'Robin',
//       lastName: 'Nguyen',
//       mobileNumber: '0412345678',
//       email: 'Huy@gmail.com',
//       address: '2/79 Victoria Street',
//       city: 'Dhaka',
//       state: 'NSW',
//       postalCode: '2121',
//     });
//   };

//   return (
//     <div className="w-full min-h-screen bg-gray-50">
//       <AppHeader />

//       {/* Profile Form */}
//       <div className="max-w-4xl mx-auto mt-8 px-4">
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="bg-blue-600 text-white p-6">
//             <h1 className="text-2xl font-bold">My Profile</h1>
//             <p className="text-blue-100">Manage your personal information</p>
//           </div>

//           <form onSubmit={handleSave} className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* First Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   First Name
//                 </label>
//                 <input
//                   type="text"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
//                   required
//                 />
//               </div>

//               {/* Last Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Last Name
//                 </label>
//                 <input
//                   type="text"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
//                   required
//                 />
//               </div>

//               {/* Mobile Number */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Mobile Number
//                 </label>
//                 <input
//                   type="tel"
//                   name="mobileNumber"
//                   value={formData.mobileNumber}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
//                   required
//                 />
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
//                   required
//                 />
//               </div>

//               {/* Address */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Address
//                 </label>
//                 <input
//                   type="text"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
//                   required
//                 />
//               </div>

//               {/* City */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   City
//                 </label>
//                 <input
//                   type="text"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
//                   required
//                 />
//               </div>

//               {/* State */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   State
//                 </label>
//                 <input
//                   type="text"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
//                   required
//                 />
//               </div>

//               {/* Postal Code */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Postal Code
//                 </label>
//                 <input
//                   type="text"
//                   name="postalCode"
//                   value={formData.postalCode}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 disabled:text-gray-600"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Buttons */}
//             <div className="mt-8 flex justify-end">
//               {!isEditing ? (
//                 <button
//                   type="button"
//                   onClick={() => setIsEditing(true)}
//                   className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Edit
//                 </button>
//               ) : (
//                 <div className="space-x-4">
//                   <button
//                     type="button"
//                     onClick={handleCancel}
//                     className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
