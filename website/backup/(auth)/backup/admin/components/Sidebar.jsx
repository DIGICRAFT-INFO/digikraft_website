'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard, PenSquare, FileText, Tag, MessageSquare,
  Settings, ChevronRight, Zap, LogOut
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'new-post', label: 'New Post', icon: PenSquare },
  { id: 'all-posts', label: 'All Posts', icon: FileText, badge: 8 },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'comments', label: 'Comments', icon: MessageSquare, badge: 1 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// Added a default fallback function 'onNavigate = () => {}' to prevent the crash
export default function Sidebar({ activeView, onNavigate = () => {}, collapsed }) {
  // Navigation items के hover state को ट्रैक करने के लिए
  const [hoveredItem, setHoveredItem] = useState(null);
  // User profile के hover state के लिए
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  // Logout button के hover state के लिए
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  // --- INTERNAL STYLES OBJECTS ---
  const styles = {
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#09090b', // zinc-950
      borderRight: '1px solid rgba(39, 39, 42, 0.6)', // zinc-800/60
      transition: 'width 300ms ease-in-out',
      width: collapsed ? '64px' : '240px',
      boxSizing: 'border-box',
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '20px 16px',
      borderBottom: '1px solid rgba(39, 39, 42, 0.6)',
      justifyContent: collapsed ? 'center' : 'flex-start',
    },
    logoIconContainer: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #8b5cf6, #4f46e5)', // violet-500 to indigo-600
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      boxShadow: '0 10px 15px -3px rgba(109, 40, 217, 0.4)', // violet-900/40 shadow
    },
    logoTextMain: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#ffffff',
      letterSpacing: '-0.025em',
      margin: 0,
    },
    logoTextSub: {
      fontSize: '10px',
      color: '#71717a', // zinc-500
      marginTop: '-2px',
      margin: 0,
    },
    navContainer: {
      flex: 1,
      padding: '16px 12px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '2px', // space-y-0.5
    },
    menuHeading: {
      fontSize: '10px',
      fontWeight: 500,
      color: '#27272a', // zinc-600
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      padding: '0 8px 8px 8px',
      margin: 0,
    },
    navButton: (isActive, isHovered) => ({
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 12px',
      borderRadius: '12px',
      fontSize: '14px',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      boxSizing: 'border-box',
      justifyContent: collapsed ? 'center' : 'flex-start',
      transition: 'all 150ms ease',
      // Active / Hover logic
      backgroundColor: isActive 
        ? '#27272a' // zinc-800
        : isHovered ? '#18181b' : 'transparent', // zinc-900 on hover
      color: isActive 
        ? '#ffffff' 
        : isHovered ? '#e4e4e7' : '#a1a1aa', // zinc-200 / zinc-400
      fontWeight: isActive ? 500 : 400,
      boxShadow: isActive ? 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' : 'none',
    }),
    accentLine: {
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '2px',
      height: '20px',
      backgroundColor: '#8b5cf6', // violet-500
      borderTopRightRadius: '9999px',
      borderBottomRightRadius: '9999px',
    },
    icon: (isActive, isHovered) => ({
      flexShrink: 0,
      transition: 'transform 150ms ease',
      color: isActive ? '#a78bfa' : 'inherit', // violet-400
      transform: (!isActive && isHovered) ? 'scale(1.1)' : 'scale(1)',
    }),
    labelText: {
      flex: 1,
      textAlign: 'left',
    },
    badge: (isActive) => ({
      fontSize: '10px',
      fontWeight: 600,
      padding: '2px 6px',
      borderRadius: '9999px',
      backgroundColor: isActive ? 'rgba(139, 92, 246, 0.2)' : '#27272a',
      color: isActive ? '#c084fc' : '#a1a1aa',
    }),
    chevron: {
      color: '#27272a',
    },
    profileSection: {
      padding: '16px 12px',
      borderTop: '1px solid rgba(39, 39, 42, 0.6)',
      display: 'flex',
      justifyContent: collapsed ? 'center' : 'stretch',
    },
    profileCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      padding: collapsed ? '0' : '8px',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'background-color 150ms ease',
      backgroundColor: (!collapsed && isProfileHovered) ? '#18181b' : 'transparent',
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #34d399, #14b8a6)', // emerald-400 to teal-500
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#ffffff',
    },
    profileDetails: {
      flex: 1,
      minWidth: 0,
    },
    profileName: {
      fontSize: '14px',
      fontWeight: 500,
      color: '#e4e4e7', // zinc-200
      margin: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    profileEmail: {
      fontSize: '11px',
      color: '#71717a', // zinc-500
      margin: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    logoutIcon: {
      color: isLogoutHovered ? '#a1a1aa' : '#27272a', // zinc-400 on hover, else zinc-600
      cursor: 'pointer',
      flexShrink: 0,
      transition: 'color 150ms ease',
    }
  };

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logoSection}>
        <div style={styles.logoIconContainer}>
          <Zap size={16} color="#ffffff" />
        </div>
        {!collapsed && (
          <div>
            <p style={styles.logoTextMain}>Quill</p>
            <p style={styles.logoTextSub}>Admin Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={styles.navContainer}>
        {!collapsed && (
          <p style={styles.menuHeading}>Menu</p>
        )}
        {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => {
          const isActive = activeView === id;
          const isHovered = hoveredItem === id;
          
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)} // Executed safely now
              title={collapsed ? label : undefined}
              onMouseEnter={() => setHoveredItem(id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={styles.navButton(isActive, isHovered)}
            >
              {/* Active accent line */}
              {isActive && !collapsed && <span style={styles.accentLine} />}

              <Icon
                size={18}
                style={styles.icon(isActive, isHovered)}
              />

              {!collapsed && (
                <>
                  <span style={styles.labelText}>{label}</span>
                  {badge !== undefined && (
                    <span style={styles.badge(isActive)}>
                      {badge}
                    </span>
                  )}
                  {isActive && <ChevronRight size={12} style={styles.chevron} />}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* User profile */}
      <div style={styles.profileSection}>
        <div 
          style={styles.profileCard}
          onMouseEnter={() => setIsProfileHovered(true)}
          onMouseLeave={() => setIsProfileHovered(false)}
        >
          <div style={styles.avatar}>
            AC
          </div>
          {!collapsed && (
            <div style={styles.profileDetails}>
              <p style={styles.profileName}>Alex Chen</p>
              <p style={styles.profileEmail}>admin@quill.dev</p>
            </div>
          )}
          {!collapsed && (
            <LogOut 
              size={14} 
              style={styles.logoutIcon}
              onMouseEnter={() => setIsLogoutHovered(true)}
              onMouseLeave={() => setIsLogoutHovered(false)}
            />
          )}
        </div>
      </div>
    </aside>
  );
}