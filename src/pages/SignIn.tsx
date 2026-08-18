import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button_big";

import { login, getCurrentUser } from "../api/authApi";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store";
import { setAuth } from "../features/auth/authSlice";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);

      if (result.succeeded) {
        const user = await getCurrentUser();
        const account = user?.accounts?.[0];

        if (account?.tenantId) {
          dispatch(
            setAuth({
              userId: account.userId,
              tenantId: account.tenantId,
              roles: [],
            }),
          );
        }

        navigate("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch {
      setError("Unable to sign in. Check that the API is reachable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Bot Builder
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to manage your bots and widgets.
          </p>
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={setEmail}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
        />

        {error && (
          <p className="mb-4 text-sm font-medium text-red-600">{error}</p>
        )}

        <Button
          text={loading ? "Signing in..." : "Sign In"}
          onClick={handleLogin}
        />

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-800"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
