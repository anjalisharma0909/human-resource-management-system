import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function SignupForm() {
  return (
    <div className="space-y-6">

      <Input
        type="text"
        placeholder="Company Name"
      />

      <Input
        type="text"
        placeholder="Admin Name"
      />

      <Input
        type="email"
        placeholder="Email Address"
        icon="mail"
      />

      <Input
        type="password"
        placeholder="Create Password"
        icon="lock"
      />

      <Input
        type="password"
        placeholder="Confirm Password"
        icon="lock"
      />

      <Button text="Create Account" />

      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

    </div>
  );
}