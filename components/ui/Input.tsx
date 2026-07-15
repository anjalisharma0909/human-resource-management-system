"use client";

import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";

type InputProps = {
  type: string;
  placeholder: string;
  icon?: "mail" | "lock";
};

export default function Input({
  type,
  placeholder,
  icon,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
        {icon === "mail" && <Mail size={20} />}
        {icon === "lock" && <Lock size={20} />}
      </span>

      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        className="w-full bg-white border border-gray-300 rounded-xl py-4 pl-12 pr-12 text-gray-900 placeholder:text-gray-600 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
}