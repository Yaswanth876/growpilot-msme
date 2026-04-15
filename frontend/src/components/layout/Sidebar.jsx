import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, Megaphone, BarChart2,
  Settings, ChevronLeft, ChevronRight, Zap,
  HelpCircle, DollarSign, Truck, ReceiptText
} from 'lucide-react';
import './Sidebar.css';

const bottomItems = [
  { label: "Help", icon: HelpCircle, path: "/help" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar({ onToast, business }) {
  const [collapsed, setCollapsed] = useState(false);
  const basePath = business?.slug ? `/${business.slug}` : '';
  const displayName = business?.businessName || 'Sharma General Store';

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: `${basePath}/dashboard` },
    { label: "AI Assistant", icon: Users, path: `${basePath}/chatbot` },
    { label: "Inventory", icon: Package, path: `${basePath}/inventory` },
    { label: "Marketing AI", icon: Megaphone, path: `${basePath}/marketing` },
    { label: "Billing", icon: ReceiptText, path: `${basePath}/billing` },
    { label: "Suppliers", icon: Truck, path: `${basePath}/suppliers` },
    { label: "Expenses", icon: DollarSign, path: `${basePath}/expenses` },
    { label: "Reports", icon: BarChart2, path: `${basePath}/reports` },
  ];

  const handleBottomNav = (e, item) => {
    e.preventDefault();
    onToast?.(`${item.label} — Coming in V2!`, 'info');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <Zap size={18} fill="white" />
          </div>
          {!collapsed && (
            <div className="sidebar__logo-text">
              <span className="sidebar__brand">GrowPilot</span>
              <span className="sidebar__brand-ai"> AI</span>
            </div>
          )}
        </div>
        <button
          className="sidebar__toggle"
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Business Tag */}
      {!collapsed && (
        <div className="sidebar__business">
          <div className="sidebar__business-dot" />
          <span>{displayName}</span>
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar__nav">
        <div className="sidebar__nav-group">
          {!collapsed && <p className="sidebar__nav-label">Main Menu</p>}
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="sidebar__nav-icon" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>

        <div className="sidebar__nav-group">
          {!collapsed && <p className="sidebar__nav-label">Support</p>}
          {bottomItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="sidebar__nav-item"
              onClick={(e) => handleBottomNav(e, item)}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="sidebar__nav-icon" />
              {!collapsed && <span>{item.label}</span>}
            </a>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="sidebar__profile">
        <div className="sidebar__avatar">RS</div>
        {!collapsed && (
          <div className="sidebar__profile-info">
            <p className="sidebar__profile-name">Rajesh Sharma</p>
            <p className="sidebar__profile-role">Store Owner</p>
          </div>
        )}
      </div>
    </aside>
  );
}
