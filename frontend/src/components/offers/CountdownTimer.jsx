import { useState, useEffect } from "react";

const pad = (n) => String(n).padStart(2, "0");

const getTimeLeft = (endDate) => {
  const diff = new Date(endDate) - Date.now();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s, totalHours: d * 24 + h };
};

const CountdownTimer = ({ endDate }) => {
  const [time, setTime] = useState(() => getTimeLeft(endDate));

  useEffect(() => {
    if (!time) return;
    const id = setInterval(() => {
      const t = getTimeLeft(endDate);
      setTime(t);
      if (!t) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (!time) {
    return <span className="countdown--expired">Offer Ended</span>;
  }

  const urgent = time.totalHours < 24;

  const Unit = ({ value, label }) => (
    <div className="countdown__unit">
      <span className={`countdown__num${urgent ? " countdown__num--urgent" : ""}`}>
        {pad(value)}
      </span>
      <span className="countdown__sub">{label}</span>
    </div>
  );

  return (
    <div className="countdown">
      <span className="countdown__label">Ends in</span>
      {time.d > 0 && (
        <>
          <Unit value={time.d} label="days" />
          <span className="countdown__sep">:</span>
        </>
      )}
      <Unit value={time.h} label="hrs" />
      <span className="countdown__sep">:</span>
      <Unit value={time.m} label="min" />
      <span className="countdown__sep">:</span>
      <Unit value={time.s} label="sec" />
    </div>
  );
};

export default CountdownTimer;