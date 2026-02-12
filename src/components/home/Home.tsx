import "./Home.css";
import QuickStats from "./QuickStats";
import QuickAddReminder from "./QuickAddReminder";
import UpcomingReminders from "./UpcomingReminders";

export default function Home() {
  return (
    <div className="HomePage">
      <div className="HomePage__container">
        <h1 className="HomePage__header">Dashboard</h1>
        <QuickStats />
        <QuickAddReminder />
        <UpcomingReminders />
      </div>
    </div>
  );
}
