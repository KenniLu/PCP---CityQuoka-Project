import Link from 'next/link';
import Image from 'next/image';
import {User, Mailbox, MapPin, MapPinHouse, Phone} from "lucide-react"; // icons
import {useState} from 'react';
import Footer from '@/components/Footer/';

export default function ProfileView() {
  // sample data
  const user_id = [
    {
      id: 1,
      fullname: "K Lim",
      mobile: "0123456789",
      email: "name@gmail.com",
      address: "XX Street Suburb State",
      postalcode: "xxxx",
    },
  ];

  const user = user_id[0]; // take the first user

  return (
    <div className="min-h-screen p-10">
      <div className="flex items-start gap-8">
        {/* Left column: pill + avatar */}
        <aside className="w-56 flex flex-col items-center space-y-6">
          <div className="bg-[#A170ED] text-white rounded-full px-6 py-3 text-xl">
            My Profile
          </div>

          <div className="w-40 h-40 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
            <p> 
                <User size = {160}/>
            </p>
          </div>
        </aside>

        {/* Right column: profile card */}
        <main className="flex-1 max-w-2xl w-full">
          <div className="bg-[#A170ED] p-6 rounded-3xl">
            <div className="bg-white rounded-3xl p-6 shadow">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium">Full Name</h3>
                  <p className="border-b border-black flex gap-2 items-center mt-2"> <User size ={15}/> {user.fullname}</p>

                  <h3 className="mt-6 text-lg font-medium">Mobile Number</h3>
                  <p className="border-b border-black flex gap-2 items-center mt-2"> <Phone size ={15}/> {user.mobile}</p>

                  <h3 className="mt-6 text-lg font-medium">Email</h3>
                  <p className="border-b border-black flex gap-2 items-center mt-2"><Mailbox size ={15}/>{user.email}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Address</h3>
                  <p className="border-b border-black flex gap-2 items-center mt-2"><MapPinHouse size ={15}/>{user.address}</p>

                  <h3 className="mt-6 text-lg font-medium">Postal Code</h3>
                  <p className="border-b border-black flex gap-2 items-center mt-2"><MapPin size ={15}/>{user.postalcode}</p>
                </div>
              </div>

              <div className="mt-6 text-right">
                <Link href="/editview">
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
 
