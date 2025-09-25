
'use client';
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {User, Mailbox, MapPin, MapPinHouse, Phone} from "lucide-react"; // icons
import ValidatedInput from "@/components/InputValidation";

export default function ProfileEdit() {
  const router = useRouter();

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

  const user = user_id[0];

  const [form, setForm] = useState({
    fullname: user.fullname,
    mobile: user.mobile,
    email: user.email,
    address: user.address,
    postalcode: user.postalcode,
  });

  function save() {
    // Placeholder save logic
    console.log("Updated user:", form);
    router.push("/profileview");
  }

  return (
    <div className="min-h-screen p-10">
      <div className="flex items-start gap-8">
        {/* Left column */}
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

        {/* Edit form */}
        <main className="flex-1 max-w-2xl w-full">
          <div className="bg-[#A170ED] p-6 rounded-3xl">
            <div className="bg-white rounded-3xl p-6 shadow">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium">Full Name</h3>
                  <div className="mt-2 relative flex gap-2 items-center"> 
                    <User className="absolute left-3" size={15} />
                    <input 
                      value={form.fullname} 
                      onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                      className="pl-8 border p-2 rounded"
                    /> 
                  </div>

                  <h3 className="mt-3 text-lg font-medium">Mobile Number</h3>
                  <div className="mt-2 relative flex gap-2 items-center"> 
                    <ValidatedInput
                        value={form.mobile}
                        onChange={(val) => setForm({ ...form, mobile: val })}
                        placeholder="Mobile Number"
                        icon={Phone}
                        validationType="phone"
                        type="tel"
                      />
                  </div>

                  {/* <label className="block text-sm font-medium mt-4">Email</label> */}
                  <h3 className="mt-3 text-lg font-medium">Email</h3>
                  <div className="mt-2 relative flex gap-2 items-center"> 
                    <ValidatedInput
                      value={form.email}
                      onChange={(val) => setForm({ ...form, email: val })}
                      placeholder="Email"
                      icon={Mailbox}
                      validationType="email"
                      type="email"
                    />
                    </div>
                </div>
                    
                <div>
                  {/* <label className="block text-sm font-medium">Address</label> */}
                  <h3 className= "text-lg font-medium">Address</h3>
                  <div className="mt-2 relative flex gap-2 items-center">  
                    <MapPinHouse className="absolute left-3" size={15} />
                    <input
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="pl-8 border p-2 rounded"
                    />
                  </div>

                  {/* <label className="block text-sm font-medium mt-4">Postal Code</label> */}
                  <h3 className="mt-3 text-lg font-medium">Postal Code</h3>
                  <div className="mt-2 relative flex gap-2 items-center"> 
                    <ValidatedInput
                      value={form.postalcode}
                      onChange={(val) => setForm({ ...form, postalcode: val })}
                      placeholder="Postal Code"
                      icon={MapPin}
                      validationType="postal"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-4 justify-end">
                <button
                  onClick={save}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow"
                >
                  Save
                </button>

                <Link href="/profileview">
                  <button className="bg-white border px-4 py-2 rounded-lg shadow">
                    Cancel
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
