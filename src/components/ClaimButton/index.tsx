"use client";
import { useState } from "react";

export default function ClaimButton() {
  const statuses = ["Claim Now", "Ready to Use", "Claimed"];
  const [statusIndex, setStatusIndex] = useState(0);

  const handleClick = () => {
    setStatusIndex((prevIndex) => (prevIndex + 1) % statuses.length);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-full font-semibold transition ${
        statusIndex === 0
          ? "bg-green-500 text-white"
          : statusIndex === 1
          ? "bg-yellow-500 text-black"
          : "bg-gray-400 text-white"
      }`}
    >
      {statuses[statusIndex]}
    </button>
  );
}