import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import CountUp from "react-countup";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function UserDashboard() {
  const navigate = useNavigate();
  const balanceRef = useRef(null);

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    fetch("/api/auth/verify", { credentials: "include" })
      .then((res) => {
        if (res.status === 401) navigate("/login");
        setCheckingAuth(false);
      })
      .catch(() => setCheckingAuth(false));
  }, [navigate]);

  const burstFromBalance = () => {
    if (!balanceRef.current) return;
    const rect = balanceRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { x, y },
      colors: ["#7dd3fc", "#c4b5fd", "#f9a8d4"]
    });
  };

  const handleCheckBalance = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/balance", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) return;
      setBalance(data.balance);
      burstFromBalance();
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) return <div>Loading...</div>;

  const spendingData = [
    { name: "Mon", amount: 2000 },
    { name: "Tue", amount: 3500 },
    { name: "Wed", amount: 1800 },
    { name: "Thu", amount: 4000 },
    { name: "Fri", amount: 2800 },
    { name: "Sat", amount: 3200 },
    { name: "Sun", amount: 2500 }
  ];

  const comparisonData = [
    { name: "Income", value: 50000 },
    { name: "Expense", value: 22000 }
  ];

  return (
    <div className="dashboard-wrapper">

      <header className="topbar">
        <h1>KodBank Dashboard</h1>
        <button onClick={() => navigate("/login")}>Logout</button>
      </header>

      <div className="dashboard-grid">

        {/* BALANCE CARD */}
        <div className="card balance-card" ref={balanceRef}>
          <h3>Total Balance</h3>
          <h1>
            {balance !== null ? (
              <>
                ₹ <CountUp end={balance} duration={2} separator="," />
              </>
            ) : (
              "—"
            )}
          </h1>
          <button onClick={handleCheckBalance}>
            {loading ? "Checking..." : "Reveal Balance"}
          </button>
        </div>

        {/* SPENDING AREA CHART */}
        <div className="card chart-card">
          <h3>Weekly Spending</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#6366f1"
                fill="#a5b4fc"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="card chart-card">
          <h3>Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#7dd3fc" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
      {/* ========================= */}
{/* BALANCE INSIGHTS SECTION */}
{/* ========================= */}

<div className="extra-section">

{/* USER PROFILE CARD */}
<div className="card profile-card">
  <h3>Account Details</h3>
  <div className="profile-grid">
    <div>
      <p className="label">Account Holder</p>
      <p className="value">Demo User</p>
    </div>
    <div>
      <p className="label">Account Type</p>
      <p className="value">Savings Account</p>
    </div>
    <div>
      <p className="label">Account Number</p>
      <p className="value">•••• 1234</p>
    </div>
    <div>
      <p className="label">Branch</p>
      <p className="value">Digital Banking</p>
    </div>
    <div>
      <p className="label">Status</p>
      <p className="value active">Active</p>
    </div>
  </div>
</div>

{/* BALANCE WRITE-UP */}
<div className="card insights-card">
  <h3>Balance Overview</h3>

  <p>
    Your current total balance reflects a healthy financial standing.
    Weekly spending remains stable with moderate fluctuations during mid-week.
  </p>

  <div className="insight-stats">
    <div>
      <h4>₹ 50,000</h4>
      <p>Monthly Income</p>
    </div>

    <div>
      <h4>₹ 22,000</h4>
      <p>Monthly Expense</p>
    </div>

    <div>
      <h4>₹ 28,000</h4>
      <p>Estimated Savings</p>
    </div>
  </div>

  <p className="small-note">
    Tip: Maintaining expenses below 50% of income ensures long-term growth.
  </p>
</div>

{/* RECENT ACTIVITY */}
<div className="card activity-card">
  <h3>Recent Activity</h3>
  <ul>
    <li>✔ Salary credited — ₹ 50,000</li>
    <li>➖ Amazon purchase — ₹ 2,499</li>
    <li>➖ Electricity bill — ₹ 1,850</li>
    <li>➖ UPI Transfer — ₹ 500</li>
  </ul>
</div>

</div>

</div>
    
  );
}