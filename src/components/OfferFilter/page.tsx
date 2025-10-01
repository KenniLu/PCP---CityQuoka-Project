'use client';
import {CircleCheckBig, Clock } from "lucide-react"; // icons 
import {useState} from 'react';

export default function OfferFilter() {
    const [offerType, setOfferType] = useState([
        'Featured',
        'Nearby',
        'This Week',
    ]);
    const [active, setActive] = useState('Featured');

    return (
    <div className = 'flex justify-betwen items-center w-full'>
      {/* Offer Filter Box */}
      <nav className="flex gap-30 justify-evenly w-9/12 mx-auto bg-[#FFE2A8] rounded-xl border-2 border-black  shadow-md px-6 py-4">
        {offerType.map((type) => (
          <div
            key = {type}
            className={`px-6 py-2 rounded-full font-semibold transition 
              ${
                active === type
                  ? "bg-red-600 text-white border-b-4 border-red-800"
                  : "bg-gray-200 text-black"
              }`}
              >
              <button
                onClick={() => setActive(type)}>
              {type}
              </button>
          </div> ))}
      </nav>
      
       {/* Dropdown on the right */}
        <select
            className="bg-gray-200 border border-black text-black text-sm rounded-full px-4 py-2 mr-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
            <option value="all">All</option>
            <option value="unclaimed">Unclaimed</option>
            <option value="ready">Ready to Use</option>
            <option value="claimed">Claimed</option>
        </select>    
    </div>);
      }