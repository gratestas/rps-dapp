import { useEffect, useState } from 'react';

interface CountDownProps {
  lastAction: number | null;
  timeout: number | null;
}

const useCountDown = ({ lastAction, timeout }: CountDownProps) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    if (!timeout || !lastAction) return;
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const elapsedSeconds = now - lastAction;
      const remaining = timeout - elapsedSeconds;

      setRemainingTime(remaining > 0 ? remaining : 0);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastAction, timeout]);

  return remainingTime;
};

export default useCountDown;
