import "./AlertForm.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export default ({
  updateAlertOptions,
}: {
  updateAlertOptions: (ms: number) => void;
}) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [ms, setMs] = useState(0);
  const [showMore, setShowMore] = useState(false);

  // 86,400,000 = 1 day
  // 3,600,000 = 1 hour
  // 60000 = 1 minute

  function handleChange(part: string, val: number) {
    const num = val || 0;

    if (part === "days") {
      setDays(num);
    } else if (part === "hours") {
      setHours(num);
    } else if (part === "minutes") {
      setMinutes(num);
    } else if (part === "seconds") {
      setSeconds(num);
    } else {
      setMs(num);
    }
  }

  useEffect(() => {
    const newTotal =
      days * 86400000 + hours * 3600000 + minutes * 60000 + seconds * 1000 + ms;
    updateAlertOptions(newTotal);
  }, [days, hours, minutes, seconds]);

  return (
    <>
      <div className="form-group">
        <label htmlFor="reminder-alert-days">Days</label>
        <input
          id="reminder-alert-days"
          type="number"
          value={days}
          onChange={(e) => handleChange("days", e.target.valueAsNumber)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="reminder-alert-hours">Hours</label>
        <input
          id="reminder-alert-hours"
          type="number"
          value={hours}
          onChange={(e) => handleChange("hours", e.target.valueAsNumber)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="reminder-alert-minutes">Minutes</label>
        <input
          id="reminder-alert-minutes"
          type="number"
          value={minutes}
          onChange={(e) => handleChange("minutes", e.target.valueAsNumber)}
        />
      </div>

      {showMore || seconds || ms ? (
        <>
          <div className="form-group">
            <label htmlFor="reminder-alert-seconds">Seconds</label>
            <input
              id="reminder-alert-seconds"
              type="number"
              value={seconds}
              onChange={(e) => handleChange("seconds", e.target.valueAsNumber)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reminder-alert-ms">Milliseconds</label>
            <input
              id="reminder-alert-ms"
              type="number"
              value={ms}
              onChange={(e) => handleChange("ms", e.target.valueAsNumber)}
            />
          </div>
        </>
      ) : null}

      <div className="ActionOptions__button-container">
        <button
          disabled={seconds > 0 || ms > 0}
          className="btn btn--ghost"
          type="button"
          onClick={() => setShowMore((p) => !p)}
        >
          {showMore ? (
            <>
              <ChevronUp /> Show less options
            </>
          ) : (
            <>
              <ChevronDown />
              Show more options
            </>
          )}
        </button>
      </div>
    </>
  );
};
