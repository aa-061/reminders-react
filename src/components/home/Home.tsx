import "./Home.css";
import { Link } from "@tanstack/react-router";
import RemindersList from "../reminders-list/RemindersList";

export default () => {
  return (
    <>
      <p>Home component</p>
      <Link to="/reminders/new">Add new reminder</Link>
      <RemindersList />
    </>
  );
};
