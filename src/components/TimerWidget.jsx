import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const TimerWidget = () => {
  // Preset time state (adjustable when idle)
  const [setHours, setSetHours] = useState(0);
  const [setMinutes, setSetMinutes] = useState(0);
  const [setSeconds, setSetSeconds] = useState(10); // default to 10 seconds for easy testing

  // Countdown running state
  const [totalSeconds, setTotalSeconds] = useState(10);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef(null);

  // Play a soft beep when timer completes
  const playBeep = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Beep 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.45);

      // Beep 2 (delayed slightly)
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
        gain2.gain.setValueAtTime(0.3, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.65);
      }, 350);

    } catch (e) {
      console.warn('Audio Context block/error:', e);
    }
  };

  // Timer loop
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isPaused]);

  // Total seconds remaining helper
  const handleStart = () => {
    if (isRunning) {
      // Pause
      setIsPaused(true);
      setIsRunning(false);
    } else if (isPaused) {
      // Resume
      setIsRunning(true);
      setIsPaused(false);
    } else {
      // Start new
      const total = setHours * 3600 + setMinutes * 60 + setSeconds;
      if (total <= 0) return;
      setTotalSeconds(total);
      setSecondsLeft(total);
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setSecondsLeft(0);
  };

  // Adjust timers helpers
  const adjustValue = (unit, increment) => {
    if (isRunning || isPaused) return; // disable during run

    if (unit === 'hours') {
      setSetHours((prev) => {
        const next = prev + increment;
        return next >= 0 && next <= 24 ? next : prev;
      });
    } else if (unit === 'minutes') {
      setSetMinutes((prev) => {
        let next = prev + increment;
        if (next < 0) next = 59;
        if (next > 59) next = 0;
        return next;
      });
    } else if (unit === 'seconds') {
      setSetSeconds((prev) => {
        let next = prev + increment;
        if (next < 0) next = 59;
        if (next > 59) next = 0;
        return next;
      });
    }
  };

  // Format Helper: pad with zero
  const padZero = (val) => String(val).padStart(2, '0');

  // Display computations
  const currentSeconds = isRunning || isPaused ? secondsLeft : (setHours * 3600 + setMinutes * 60 + setSeconds);
  const displayHrs = Math.floor(currentSeconds / 3600);
  const displayMins = Math.floor((currentSeconds % 3600) / 60);
  const displaySecs = currentSeconds % 60;

  // Circular progress stroke math
  // Circumference = 2 * PI * r = 2 * 3.14159 * 45 = 282.74 -> 283
  const circumference = 283;
  const strokeOffset = totalSeconds > 0 
    ? circumference - (currentSeconds / totalSeconds) * circumference 
    : circumference;

  return (
    <div className="timer-widget">
      {/* Circular Progress Ring */}
      <div className="timer-left">
        <svg className="timer-svg">
          <circle cx="60" cy="60" r="45" className="timer-circle-bg" />
          <circle
            cx="60"
            cy="60"
            r="45"
            className="timer-circle-progress"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: isRunning || isPaused ? strokeOffset : 0,
            }}
          />
        </svg>
        <div className="timer-display-text">
          {padZero(displayHrs)}:{padZero(displayMins)}:{padZero(displaySecs)}
        </div>
      </div>

      {/* Adjusters & Buttons */}
      <div className="timer-right">
        <div className="timer-controls-grid">
          {/* Hours */}
          <div className="timer-unit">
            <span className="timer-unit-label">Hours</span>
            <button className="timer-arrow-btn" onClick={() => adjustValue('hours', 1)} disabled={isRunning || isPaused}>
              <ChevronUp size={24} />
            </button>
            <span className="timer-unit-val">{padZero(setHours)}</span>
            <button className="timer-arrow-btn" onClick={() => adjustValue('hours', -1)} disabled={isRunning || isPaused}>
              <ChevronDown size={24} />
            </button>
          </div>
          
          <span className="timer-separator">:</span>

          {/* Minutes */}
          <div className="timer-unit">
            <span className="timer-unit-label">Minutes</span>
            <button className="timer-arrow-btn" onClick={() => adjustValue('minutes', 1)} disabled={isRunning || isPaused}>
              <ChevronUp size={24} />
            </button>
            <span className="timer-unit-val">{padZero(setMinutes)}</span>
            <button className="timer-arrow-btn" onClick={() => adjustValue('minutes', -1)} disabled={isRunning || isPaused}>
              <ChevronDown size={24} />
            </button>
          </div>

          <span className="timer-separator">:</span>

          {/* Seconds */}
          <div className="timer-unit">
            <span className="timer-unit-label">Seconds</span>
            <button className="timer-arrow-btn" onClick={() => adjustValue('seconds', 1)} disabled={isRunning || isPaused}>
              <ChevronUp size={24} />
            </button>
            <span className="timer-unit-val">{padZero(setSeconds)}</span>
            <button className="timer-arrow-btn" onClick={() => adjustValue('seconds', -1)} disabled={isRunning || isPaused}>
              <ChevronDown size={24} />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
          <button className="timer-action-btn" onClick={handleStart}>
            {isRunning ? 'Pause' : isPaused ? 'Resume' : 'Start'}
          </button>
          {(isRunning || isPaused || currentSeconds !== (setHours * 3600 + setMinutes * 60 + setSeconds)) && (
            <button 
              className="timer-action-btn" 
              style={{ backgroundColor: '#555', width: '35%' }} 
              onClick={handleReset}
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerWidget;
