import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function BalanceDisplay({ balance }) {
  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <div className="balance-display">
      <p className="balance-message">Your balance is: <strong>${Number(balance).toFixed(2)}</strong></p>
    </div>
  );
}
