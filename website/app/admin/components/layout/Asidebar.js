"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Home,
  User,
  Layers,
  Phone,
  HelpCircle,
  Users,
  LogOut,
  Shield,
  Search,
  MessageCircle,
  Send,
  Settings,
} from "lucide-react";
import "./Asidebar.css";

const Asidebar = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    setIsMounted(true);
    const role = localStorage.getItem("role") || "user";
    setUserRole(role);
  }, []);

  // All menu items with role access
  const allMainMenuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
      link: "/admin/dashboard",
      roles: ["superadmin", "admin", "author"],
    },
    {
      id: "homepage",
      name: "Homepage",
      icon: Home,
      link: "/admin/homepage",
      roles: ["superadmin", "admin"],
    },
    {
      id: "about",
      name: "About",
      icon: User,
      link: "/admin/about",
      roles: ["superadmin", "admin"],
    },
    {
      id: "services",
      name: "Services",
      icon: Layers,
      link: "/admin/services",
      roles: ["superadmin", "admin"],
    },
    {
      id: "projects",
      name: "Projects",
      icon: Briefcase,
      link: "/admin/projects",
      roles: ["superadmin", "admin", "author"],
    },
    {
      id: "blog",
      name: "Blog",
      icon: FileText,
      link: "/admin/blog",
      roles: ["superadmin", "admin", "author"],
    },
    {
      id: "contact",
      name: "Contact",
      icon: Phone,
      link: "/admin/contact",
      roles: ["superadmin", "admin", "author"],
    },
    {
      id: "seo",
      name: "SEO",
      icon: Search,
      link: "/admin/seo",
      roles: ["superadmin", "admin"],
    },
    {
      id: "slides",
      name: "Slides/CMS",
      icon: Layers,
      link: "/admin/slides",
      roles: ["superadmin", "admin"],
    },
  ];

  const allBottomMenuItems = [
    {
      id: "enquiry",
      name: "Enquiry",
      icon: HelpCircle,
      link: "/admin/enquiry",
      roles: ["superadmin", "admin", "author"],
    },
    {
      id: "telegram",
      name: "Telegram",
      icon: Send,
      link: "/admin/telegram",
      roles: ["superadmin"],
    },
    {
      id: "whatsapp-chat",
      name: "WhatsApp",
      icon: Phone,
      link: "/admin/whatsapp-chat",
      roles: ["superadmin"],
    },
    {
      id: "facebook-chat",
      name: "Facebook",
      icon: MessageCircle,
      link: "/admin/facebook-chat",
      roles: ["superadmin"],
    },
    {
      id: "instagram-chat",
      name: "Instagram",
      icon: MessageCircle,
      link: "/admin/instagram-chat",
      roles: ["superadmin"],
    },
    {
      id: "social-connect",
      name: "Social Media",
      icon: MessageCircle,
      link: "/admin/social-connect",
      roles: ["admin", "author"],
    },
    {
      id: "logs",
      name: "Activity Logs",
      icon: FileText,
      link: "/admin/logs",
      roles: ["superadmin"],
    },
    {
      id: "whatsapp",
      name: "Integrations",
      icon: Settings,
      link: "/admin/whatsapp",
      roles: ["superadmin"],
    },
    {
      id: "users",
      name: "Users",
      icon: Users,
      link: "/admin/users",
      roles: ["superadmin"],
    },
  ];

  // Filter menu items based on user role
  const mainMenuItems = allMainMenuItems.filter(
    (item) => item.roles.includes(userRole)
  );
  const bottomMenuItems = allBottomMenuItems.filter(
    (item) => item.roles.includes(userRole)
  );

  if (!isMounted) {
    return <div className="sidebar-container" />;
  }

  return (
    <div className="sidebar-container">

      {/* ── Logo ── */}
      <div className="logo-section">
        <span className="logo-text">
          <img
            src="https://demo.digikraftsocial.com/public/uploads/logo_digifoot.png"
            alt="DigiKraft Logo"
          />
        </span>
      </div>

      {/* ── Main Nav ── */}
      <p className="section-label">Main</p>
      <nav className="nav-menu">
        {mainMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.link;
          return (
            <Link
              key={item.id}
              href={item.link}
              className={`nav-link ${isActive ? "active" : "inactive"}`}
            >
              <div className="icon-wrapper">
                <Icon className="nav-icon" size={17} />
              </div>
              <span className="link-text">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Nav ── */}
      {bottomMenuItems.length > 0 && (
        <>
          <div className="sidebar-spacer" />
          <hr className="sidebar-divider" />
          <p className="section-label" style={{ paddingTop: "4px" }}>System</p>

          <nav className="nav-menu bottom-nav">
            {bottomMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.link;
              return (
                <Link
                  key={item.id}
                  href={item.link}
                  className={`nav-link ${isActive ? "active" : "inactive"}`}
                >
                  <div className="icon-wrapper">
                    <Icon className="nav-icon" size={17} />
                  </div>
                  <span className="link-text">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </>
      )}

      {/* Role indicator */}
      <div style={{ padding: "12px 20px", marginTop: "auto", borderTop: "1px solid #f1f5f9" }}>
        <span style={{ fontSize: "10px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Role: {userRole}
        </span>
      </div>
    </div>
  );
};

export default Asidebar;
