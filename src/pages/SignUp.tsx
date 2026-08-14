import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button_big";
import "../styles/SignIn.css";

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
    <div className="page">
      <div className="card">
        <h1>Create Account</h1>

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

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Button
          text={loading ? "Creating Account..." : "Create Account"}
          onClick={handleSignUp}
        />

        <p>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
