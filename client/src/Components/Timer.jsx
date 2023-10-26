/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const Timer = ({ duration }) => {
  const [time, setTime] = useState(duration * 60); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let timerInterval;

    if (isRunning) {
      timerInterval = setInterval(() => {
        if (time > 0) {
          setTime(time - 1);
        } else {
          clearInterval(timerInterval);
          setIsRunning(false);
        }
      }, 1000);
    } else {
      clearInterval(timerInterval);
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [isRunning, time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
  };

  return (
      <span>{formatTime(time)}</span>
  );
};

export default Timer;
