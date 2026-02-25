import "./StatCard.css";

interface StatCardProps {
  title: string;
  value: number;
  trend?: number;
}

export default function StatCard({ title, value, trend }: StatCardProps) {
  return (
    <div className="StatCard">
      <h3 className="StatCard__title">{title}</h3>
      <p className="StatCard__value">{value}</p>
      {trend !== undefined && (
        <span
          className={`StatCard__trend ${trend >= 0 ? "StatCard__trend--positive" : "StatCard__trend--negative"}`}
        >
          {trend >= 0 ? "+" : ""}
          {trend}%
        </span>
      )}
    </div>
  );
}
