import "./RemindersList.css";
import { useQuery } from "@tanstack/react-query";

export default () => {
  const url = import.meta.env.VITE_SERVER_URL;

  if (!url)
    throw new Error(
      "No server URL has been provided. Make sure to set VITE_SERVER_URL env var.",
    );

  const { data, isPending, error } = useQuery({
    queryKey: ["reminders"],
    queryFn: () =>
      fetch(`${url}/reminders`, {
        // fetch("http://localhost:8080/reminders", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((r) => r.json()),
  });

  if (isPending) return <span>Loading...</span>;
  if (error) return <span>Oops!</span>;
  console.log("data = ", data);

  if (!data || !data.map) return <div>no data...</div>;
  // /reminders
  return (
    <div className="RemindersList">
      <ul>
        {/* {data.map((t: any) => (
          <li key={t.id}>{t.title}</li>
        ))} */}
      </ul>
    </div>
  );
};
