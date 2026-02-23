import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://kodbanking-o35b.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid credentials.");
        return;
      }

      navigate("/Welcome");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-full">

      {/* BRAND TITLE */}
      <h1 className="brand-title-large">KodBank</h1>

      {/* INSTAGRAM STYLE ANIMATED INTRO */}
      <div className="animated-intro">
        <span className="intro-line1">Banking, but make it</span>
        <span className="intro-line2"> Easy </span>
        <span className="intro-line3">
          “We promise not to judge your midnight Amazon purchases.”
        </span>
      </div>

      {/* COMBINED LOGIN + REGISTER CARD */}
      <div className="auth-combined-card">

        {/* LOGIN SECTION */}
        <div className="login-section">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            {error && <p className="error-text">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* DIVIDER */}
        <div className="divider"></div>

        {/* REGISTER SECTION */}
        <div className="register-section">
          <h2>New Here? </h2>
          <p>
            Join KodBank and manage your money beautifully.
          </p>

          <Link to="/register">
            <button className="register-btn">
              Create Account
            </button>
          </Link>
        </div>

      </div>

    </div>
  );
}