"use client";
import { useState } from "react";
import { User } from "lucide-react"; // example icon

export default function ValidatedInput({
  value,
  onChange,
  placeholder,
  icon: Icon,
  validate,
  type = "text",
  validationType, // e.g. "email" | "phone" | "postal"
}) {
  const [isInvalid, setIsInvalid] = useState(false);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);

    let valid = true;
    if (validationType === "phone") {
      // exactly 10 digits
      valid = /^[0-9]{10}$/.test(val);
    } else if (validationType === "email") {
      // general email regex
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    } else if (validationType === "postal") {
      // postal code: 4 to 6 digits
      valid = /^[0-9]{4,6}$/.test(val);
    } else if (validate) {
      // custom validation function if provided
      valid = validate(val);
    }

    setIsInvalid(!valid);
  };

  return (
    <div className="mt-2 relative">
      <div className = "flex gap-2 items-center"> 
        {Icon && <Icon className="absolute left-3" size={15} />}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`border p-2 rounded ${
          Icon ? "pl-8" : ""
        } ${isInvalid ? "border-red-500" : "border-gray-300"}`}
      />
      </div>
      {isInvalid && (
        <p className="text-red-500 text-sm mt-1">Invalid {placeholder}</p>
      )}
    </div>
  );
}
