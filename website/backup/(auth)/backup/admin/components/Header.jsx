'use client';

import React, { useState } from 'react';
import { Search, Bell, PanelLeftClose, PanelLeftOpen, ChevronRight } from 'lucide-react';

const BREADCRUMB_LABELS = {
  'dashboard': 'Dashboard',
  'new-post': 'New Post',
  'all-posts': 'All Posts',
  'categories': 'Categories',
  'comments': 'Comments',
  'settings': 'Settings',
};

export default function Header({ activeView, collapsed, onToggleSidebar }) {
  // Hovers और Focus states को मैनेज करने के लिए React states
  const [isToggleHovered, setIsToggleHovered] = useState(false);
  const [isBreadcrumbHovered, setIsBreadcrumbHovered] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isBellHovered, setIsBellHovered] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  // --- INTERNAL STYLES OBJECTS ---
  const styles = {
    header: {
      height: '56px', // h-14
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      paddingLeft: '20px',
      paddingRight: '20px',
      borderBottom: '1px solid rgba(39, 39, 42, 0.6)', // border-zinc-800/60
      backgroundColor: 'rgba(9, 9, 11, 0.8)', // bg-zinc-950/80
      backdropFilter: 'blur(8px)', // backdrop-blur-sm
      position: 'sticky',
      top: 0,
      zIndex: 20,
      boxSizing: 'border-box',
    },
    toggleButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 150ms ease',
      color: isToggleHovered ? '#e4e4e7' : '#71717a', // zinc-200 : zinc-500
      backgroundColor: isToggleHovered ? '#27272a' : 'transparent', // hover:bg-zinc-800
    },
    breadcrumbContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px',
    },
    breadcrumbQuill: {
      color: isBreadcrumbHovered ? '#a1a1aa' : '#27272a', // zinc-400 : zinc-600
      cursor: 'pointer',
      transition: 'color 150ms ease',
    },
    breadcrumbChevron: {
      color: '#3f3f46', // zinc-700
    },
    breadcrumbCurrent: {
      color: '#d4d4d8', // text-zinc-300
      fontWeight: 500,
    },
    searchContainer: {
      flex: 1,
      maxWidth: '384px', // max-w-sm
      marginLeft: 'auto',
      position: 'relative',
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#27272a', // zinc-600
      pointerEvents: 'none',
    },
    input: {
      width: '100%',
      height: '32px',
      backgroundColor: isInputFocused ? 'rgba(24, 24, 27, 0.8)' : '#18181b', // bg-zinc-900/80 : bg-zinc-900
      border: isInputFocused ? '1px solid #27272a' : '1px solid #27272a', // focus:border-zinc-600
      // Note: Focus border color dynamically handeled via state below if needed
      borderColor: isInputFocused ? '#52525b' : '#27272a', 
      borderRadius: '12px',
      paddingLeft: '36px',
      paddingRight: '16px',
      fontSize: '14px',
      color: '#d4d4d8', // zinc-300
      outline: 'none',
      transition: 'all 150ms ease',
      boxSizing: 'border-box',
    },
    kbd: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '10px',
      color: '#27272a', // zinc-600
      backgroundColor: '#27272a', // zinc-800
      padding: '2px 6px',
      borderRadius: '4px',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    bellButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      padding: '8px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 150ms ease',
      color: isBellHovered ? '#e4e4e7' : '#71717a', // zinc-200 : zinc-500
      backgroundColor: isBellHovered ? '#27272a' : 'transparent', // hover:bg-zinc-800
    },
    bellDot: {
      position: 'absolute',
      top: '6px',
      right: '6px',
      width: '6px',
      height: '6px',
      backgroundColor: '#8b5cf6', // violet-500
      borderRadius: '50%',
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #34d399, #14b8a6)', // emerald-400 to teal-500
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#ffffff',
      cursor: 'pointer',
      transition: 'opacity 150ms ease',
      opacity: isAvatarHovered ? 0.9 : 1, // hover:opacity-90
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
    }
  };

  return (
    <header style={styles.header}>
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        onMouseEnter={() => setIsToggleHovered(true)}
        onMouseLeave={() => setIsToggleHovered(false)}
        style={styles.toggleButton}
        aria-label="Toggle sidebar"
      >
        {collapsed
          ? <PanelLeftOpen size={18} />
          : <PanelLeftClose size={18} />
        }
      </button>

      {/* Breadcrumb */}
      <div style={styles.breadcrumbContainer}>
        <span 
          onMouseEnter={() => setIsBreadcrumbHovered(true)}
          onMouseLeave={() => setIsBreadcrumbHovered(false)}
          style={styles.breadcrumbQuill}
        >
          Quill
        </span>
        <ChevronRight size={13} style={styles.breadcrumbChevron} />
        <span style={styles.breadcrumbCurrent}>{BREADCRUMB_LABELS[activeView]}</span>
      </div>

      {/* Search */}
      <div style={styles.searchContainer}>
        <Search size={15} style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search posts, comments…"
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          style={styles.input}
          // Placeholder styling can't be purely inline easily, so we can also conditionally handle color via value if needed, but standard input properties will display natively.
        />
        <kbd style={styles.kbd}>⌘K</kbd>
      </div>

      {/* Notifications */}
      <button 
        onMouseEnter={() => setIsBellHovered(true)}
        onMouseLeave={() => setIsBellHovered(false)}
        style={styles.bellButton}
      >
        <Bell size={17} />
        <span style={styles.bellDot} />
      </button>

      {/* Avatar */}
      <div 
        onMouseEnter={() => setIsAvatarHovered(true)}
        onMouseLeave={() => setIsAvatarHovered(false)}
        style={styles.avatar}
      >
        AC
      </div>
    </header>
  );
}