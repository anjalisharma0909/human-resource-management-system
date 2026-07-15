import SignupForm from "./SignupForm";
import { Building2 } from "lucide-react";

export default function SignupCard() {
  return (
    <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-12 w-full max-w-lg mx-auto">

      <div className="text-center mb-8">

        <div className="w-20 h-20 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-5">
          <Building2 className="text-white" size={40} />
        </div>

        <h1 className="text-4xl font-bold text-gray-900">
          HRMS
        </h1>

        <p className="text-gray-700 mt-3 text-lg">
          Create Admin Account
        </p>

        <p className="text-gray-500 mt-2">
          Register your organization
        </p>

      </div>

      <SignupForm />

    </div>
  );
}