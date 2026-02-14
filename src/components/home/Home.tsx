import "./Home.css";
import QuickAddReminder from "./QuickAddReminder";
import QuickStats from "./QuickStats";
import UpcomingReminders from "./UpcomingReminders";

export default function Home() {
  return (
    <div className="HomePage">
      <div className="HomePage__container">
        {/* <h1 className="HomePage__header">Dashboard</h1> */}
        <QuickAddReminder />
        <UpcomingReminders />
        <QuickStats />
      </div>
    </div>
  );
}
