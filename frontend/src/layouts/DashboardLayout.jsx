import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Sidebar } from '../components/navigation/Sidebar';
import { Preloader } from '../components/common/Preloader';
import { GovFooter } from '../components/common/GovFooter';
import { WorkDetailModal } from '../components/common/WorkDetailModal';
import { LogoutModal } from '../components/common/LogoutModal';

export function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleToggleCollapse = () => {
    if (window.innerWidth <= 992) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <>
      <Preloader />

      <div
        className={`app-container ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
        id="appContainer"
      >
        <Sidebar
          onToggleCollapse={handleToggleCollapse}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        <Navbar
          onToggleSidebar={() => setIsMobileOpen(!isMobileOpen)}
          onSelectWork={(work) => setSelectedWork(work)}
          onOpenLogoutModal={() => setIsLogoutOpen(true)}
        />

        <main className="main-wrapper">
          <Outlet context={{ onSelectWork: setSelectedWork }} />
          <GovFooter />
        </main>
      </div>

      <WorkDetailModal
        work={selectedWork}
        isOpen={Boolean(selectedWork)}
        onClose={() => setSelectedWork(null)}
      />

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
      />
    </>
  );
}

export default DashboardLayout;
