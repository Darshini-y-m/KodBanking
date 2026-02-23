import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="welcome-screen">

      <div className="welcome-content">
        <h1 className="welcome-big">Yay!!!!! Welcome to KodBank 🎉</h1>

        <p className="welcome-quote">
          “We promise not to judge your midnight Amazon purchases.”
        </p>

        <img
          src="https://media.giphy.com/media/111ebonMs90YLu/giphy.gif"
          alt="celebration gif"
          className="welcome-gif"
        />

        <p className="loading-text">Preparing your financial empire...</p>
      </div>

    </div>
  );
}