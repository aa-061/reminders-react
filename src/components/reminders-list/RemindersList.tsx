import "./RemindersList.css";
import { useQuery } from "@tanstack/react-query";

export default () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["todos"],
    queryFn: () =>
      fetch("http://localhost:8080/reminders", {
        headers: {
          "x-api-key": "SECRET_KEY",
        },
      }).then((r) => r.json()),
  });

  if (isPending) return <span>Loading...</span>;
  if (error) return <span>Oops!</span>;

  // /reminders
  return (
    <div className="RemindersList">
      <ul>
        {data.map((t: any) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  );
};
