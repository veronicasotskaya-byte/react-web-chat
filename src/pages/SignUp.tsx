import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button_big";

import { signUp } from "../api/authApi";

function SignUp() {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignUp() {
    setError("");

    if (!companyName.trim() || !name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(companyName, name, email, password);

      if (result.succeeded) {
        alert("Account created successfully!");

        navigate("/signin");
      } else {
        setError(result.errorCode || "Unable to create account.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Create Account
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Set up your company and start building bots.
          </p>
        </div>

        <Input
          label="Company Name"
          type="text"
          value={companyName}
          placeholder="Company name"
          onChange={setCompanyName}
        />

        <Input
          label="Full Name"
          type="text"
          value={name}
          placeholder="Your name"
          onChange={setName}
        />

        <Input
          label="Email"
          type="email"
          value={email}
          placeholder="Email"
          onChange={setEmail}
        />

        <Input
          label="Password"
          type="password"
          value={password}
          placeholder="Password"
          onChange={setPassword}
        />

        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          placeholder="Confirm password"
          onChange={setConfirmPassword}
        />

        {error && (
          <p className="mb-4 text-sm font-medium text-red-600">{error}</p>
        )}

        <Button
          text={loading ? "Creating Account..." : "Create Account"}
          onClick={handleSignUp}
        />

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-medium text-indigo-600 hover:text-indigo-800"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
