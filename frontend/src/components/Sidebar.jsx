import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = {
  student: [
    { to: '/student/dashboard',    icon: '🏠', label: 'Dashboard'       },
    { to: '/student/profile',      icon: '👤', label: 'My Profile'      },
    { to: '/student/jobs',         icon: '💼', label: 'Browse Jobs'     },
    { to: '/student/applications', icon: '📋', label: 'My Applications' },
  ],
  faculty: [
    { to: '/faculty/dashboard', icon: '🏠', label: 'Dashboard' },
    { to: '/faculty/students',  icon: '👨‍🎓', label: 'Students'  },
  ],
  company: [
    { to: '/company/dashboard', icon: '🏠', label: 'Dashboard'   },
    { to: '/company/jobs',      icon: '💼', label: 'Manage Jobs' },
  ],
  admin: [
    { to: '/admin/dashboard',  icon: '🏠', label: 'Dashboard'       },
    { to: '/admin/users',      icon: '👥', label: 'All Users'        },
    { to: '/admin/students',   icon: '👨‍🎓', label: 'Students'         },
    { to: '/admin/faculty',    icon: '🏫', label: 'Faculty'          },
    { to: '/admin/companies',  icon: '🏢', label: 'Companies'        },
    { to: '/admin/assign',     icon: '🔗', label: 'Assign Students'  },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/login'); };
  const links = NAV[user?.role] || [];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>🎓</span><span>Campus Portal</span>
      </div>
      <div className="sidebar-user">
        <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
        <div>
          <div className="u-name">{user?.name}</div>
          <div className="u-role">{user?.role}</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {links.map(l => (
          <NavLink key={l.to} to={l.to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span>{l.icon}</span><span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
    </aside>
  );
}
