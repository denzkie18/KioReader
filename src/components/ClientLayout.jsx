"use client"; // Required for useState
import { useState } from "react";
import Header from "@/components/header/Header";
import SideNav from "@/components/sidenav/SideNav";
import RightSide from '@/components/rightside/RightSide';

export default function ClientLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className={`app-wrapper ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      <Header onToggle={toggleSidebar} />
      <div className="main-container">
        <SideNav isCollapsed={isCollapsed} />
        <main className="content-area">
          {children}
        </main>
        <RightSide />
      </div>
    </div>
  );
}