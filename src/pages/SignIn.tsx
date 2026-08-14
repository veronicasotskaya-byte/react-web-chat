import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button_big";
import "../styles/SignIn.css";

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
    <div className="page">
      <div className="card">
        <h1>Bot Builder</h1>

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
        {error && <p style={{ color: "red" }}>{error}</p>}

        <Button
          text={loading ? "Signing in..." : "Sign In"}
          onClick={handleLogin}
        />

        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
