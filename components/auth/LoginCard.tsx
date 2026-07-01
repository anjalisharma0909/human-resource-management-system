import LoginForm from "./LoginForm";
import { Building2 } from "lucide-react";

export default function LoginCard() {
  return (
    <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-12 w-full max-w-md mx-auto">

      <div className="text-center mb-8">

        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-5">
           <Building2 className="text-white" size={40} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          HRMS
       </h1>

        <p className="text-2xl font-semibold text-gray-800">
          Welcome Back
        </p>

        <p className="text-gray-500 mt-2">
            Please login to continue
        </p>

      </div>

      <LoginForm />

      <p className="text-center text-gray-400 text-sm mt-8">
        © 2026 HRMS • Human Resource Management System
      </p>

    </div>
  );
}