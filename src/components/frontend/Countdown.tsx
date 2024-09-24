import React, { useState, useEffect } from 'react';

interface CountdownProps {
  endTime: Date;
}

const Countdown: React.FC<CountdownProps> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft(endTime)), 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  function calculateTimeLeft(endTime: Date) {
    const difference = +new Date(endTime) - +new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return <div>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</div>;
};

export default Countdown;