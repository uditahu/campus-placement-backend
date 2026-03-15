import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const statCards = [
  { key: "students",     label: "Students",     icon: "🎓", link: "/admin/students",     color: "#1d4ed8" },
  { key: "faculty",      label: "Faculty",      icon: "👨‍🏫", link: "/admin/faculty",      color: "#7c3aed" },
  { key: "companies",    label: "Companies",    icon: "🏢", link: "/admin/companies",    color: "#d97706" },
  { key: "jobs",         label: "Active Jobs",  icon: "💼", link: "/admin/jobs",         color: "#16a34a" },
  { key: "applications", label: "Applications", icon: "📋", link: "/admin/applications", color: "#0891b2" },
  { key: "assignments",  label: "Assignments",  icon: "🔗", link: "/admin/assignments",  color: "#dc2626" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of the campus placement system</p>
      </div>

      <div className="grid grid-3">
        {statCards.map(card => (
          <Link
            key={card.key}
            to={card.link}
            className="stat-card"
            style={{ '--stat-color': card.color }}
          >
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-number">
              {loading ? "—" : (stats[card.key] ?? 0)}
            </div>
            <div className="stat-label">{card.label}</div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 28, padding: '16px 20px', background: 'var(--blue-light)', borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>ℹ️</span>
        <span>Click any card to manage that section. Use <strong>Assignments</strong> to pair students with faculty mentors.</span>
      </div>
    </div>
  );
}
