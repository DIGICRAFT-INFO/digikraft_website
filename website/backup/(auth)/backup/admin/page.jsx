'use client';

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header'; // Agar aapka header component hai

// 1. Apne saare views ko import karein
import DashboardView from './components/views/DashboardView';
import PostEditorView from './components/views/PostEditorView';
import AllPostsView from './components/views/AllPostsView';
import CategoriesView from './components/views/CategoriesView';
import CommentsView from './components/views/CommentsView';
import SettingsView from './components/views/SettingsView';

export default function AdminDashboardPage() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 2. Ek function banayein jo activeView ke id ke basis par sahi component return kare
  const renderCurrentView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'new-post':
        return <PostEditorView />;
      case 'all-posts':
        return <AllPostsView />;
      case 'categories':
        return <CategoriesView />;
      case 'comments':
        return <CommentsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />; // Fallback view
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#09090b' }}>
      
      {/* SIDEBAR */}
      <Sidebar 
        activeView={activeView} 
        onNavigate={(viewId) => setActiveView(viewId)} 
        collapsed={isCollapsed} 
      />

      {/* MAIN CONTENT CONTAINER */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* HEADER (Optional: sidebar toggle button ke sath) */}
        <Header 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
        />

        {/* DYNAMIC VIEW PANEL */}
        <main style={{ flex: 1, padding: '24px', color: '#ffffff', overflowY: 'auto' }}>
          {/* 3. Yahan par active view component dynamically load hoga */}
          {renderCurrentView()}
        </main>
        
      </div>
    </div>
  );
}