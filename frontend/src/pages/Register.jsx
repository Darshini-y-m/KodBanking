import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.message ||
          data.errors?.[0]?.msg ||
          'Registration failed'
        );
        return;
      }

      navigate('/login');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-full">

      {/* BIG BRAND */}
      <h1 className="brand-title-large">KodBank</h1>

      <div className="animated-intro">
        <span className="intro-line1">
          Your digital finance companion.
        </span>
        <span className="intro-line2">
          ✨ Choose what's best for you ✨
        </span>
        <span className="intro-line3">
          “Savings today = future you saying thank you.”
        </span>
      </div>

      <div className="auth-combined-card">

        {/* LEFT SIDE – REGISTER FORM */}
        <div className="login-section">
          <h2>Create Account ✨</h2>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              minLength={3}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
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
              minLength={6}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={handleChange}
            />

            {error && (
              <p className="error-text">{error}</p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>

          </form>

          <p>
            Already have an account?{' '}
            <Link to="/login">Login</Link>
          </p>
        </div>

        <div className="divider"></div>

        {/* RIGHT SIDE – MESSAGE */}
        <div className="register-section">
          <h2>Welcome </h2>
          <p>
            Join KodBank and manage your money beautifully.
          </p>
          <p>
            Smart savings. Soft spendings. Financial glow-up.
          </p>
        </div>

      </div>
    </div>
  );
}