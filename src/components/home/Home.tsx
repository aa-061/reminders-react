import "./Home.css";
import QuickAddReminder from "./QuickAddReminder";
import QuickStats from "./QuickStats";
import UpcomingReminders from "./UpcomingReminders";
import RemindersCalendar from "@/components/reminders-calendar/RemindersCalendar";

export default function Home() {
  return (
    <div className="HomePage">
      <div className="HomePage__container">
        {/* <h1 className="HomePage__header">Dashboard</h1> */}
        <QuickAddReminder />
        <UpcomingReminders />
        <RemindersCalendar />
        <QuickStats />
      </div>
    </div>
  );
}
