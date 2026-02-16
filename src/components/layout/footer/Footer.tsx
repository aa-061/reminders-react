import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="Footer">
      <div className="Footer__content">
        <p className="Footer__copyright">&copy; {currentYear} Reminders App</p>
        <p className="Footer__tagline">Never forget what matters</p>
      </div>
    </footer>
  );
}
