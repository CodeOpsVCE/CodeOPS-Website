import { useEffect, useState } from "react";

export function useCountdown(targetDate) {
  const [remaining, setRemaining] = useState(() => calc(targetDate));

  useEffect(() => {
    const id = setInterval(() => setRemaining(calc(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return remaining;
}

function calc(targetDate) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, expired: false };
}