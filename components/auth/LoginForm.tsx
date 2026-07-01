import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function LoginForm() {
  return (
    <div className="space-y-6">
      <Input
        type="email"
        placeholder="Email / Employee ID"
        icon="mail"
      />

      <Input
        type="password"
        placeholder="Enter your password"
        icon="lock"
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 accent-blue-600 cursor-pointer"
          />
          <span>Remember Me</span>
        </label>

        <a
          href="#"
          className="text-blue-600 text-sm font-medium hover:text-blue-700 hover:underline transition duration-300"
        >
          Forgot Password?
        </a>
      </div>

      <Button text="Login" />

      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Don't have an admin account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}