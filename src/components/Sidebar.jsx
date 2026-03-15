import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navConfig = {
  student: [
    { to: "/student/dashboard", icon: "💼", label: "Available Jobs" },
    { to: "/student/applications", icon: "📋", label: "My Applications" },
    { to: "/student/profile", icon: "👤", label: "My Profile" },
  ],
  faculty: [
    { to: "/faculty/dashboard", icon: "🎓", label: "Assigned Students" },
  ],
  company: [
    { to: "/company/dashboard", icon: "📊", label: "My Jobs" },
    { to: "/company/post-job", icon: "➕", label: "Post a Job" },
  ],
  admin: [
    { to: "/admin/dashboard", icon: "🏠", label: "Dashboard" },
    { to: "/admin/students", icon: "🎓", label: "Students" },
    { to: "/admin/faculty", icon: "👨‍🏫", label: "Faculty" },
    { to: "/admin/companies", icon: "🏢", label: "Companies" },
    { to: "/admin/jobs", icon: "💼", label: "Jobs" },
    { to: "/admin/applications", icon: "📋", label: "Applications" },
    { to: "/admin/assignments", icon: "🔗", label: "Assignments" },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const links = navConfig[user.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <NavLink to={`/${user.role}/dashboard`} className="logo-text">
          🎓 Cloud MPR
        </NavLink>
        <div className="logo-sub">Campus Placement Portal</div>
      </div>

      <div className="sidebar-user">
        <div className="user-role">{user.role}</div>
        <div className="user-email">{user.userId ? `User #${user.userId}` : "Logged in"}</div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <div className="sidebar-section-label">Navigation</div>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
            >
              <span className="link-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span>🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
