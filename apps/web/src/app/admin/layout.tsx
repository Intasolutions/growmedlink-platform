'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { AdminSidebar } from '../../components/AdminSidebar';
import { AdminNavbar } from '../../components/AdminNavbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN', 'EDITOR']}>
      <style>{`
        /* Restore scrollbars inside admin panel */
        .admin-root ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
        .admin-root ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
        .admin-root * { scrollbar-width: thin; -ms-overflow-style: auto; }
      `}</style>
      <div className="admin-root min-h-screen flex bg-[#020C1B]">
        {/* Sidebar Navigation */}
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Right Content Area */}
        <div className="flex-grow flex flex-col lg:pl-64 min-w-0">
          {/* Top Navbar */}
          <AdminNavbar onMenuToggle={() => setSidebarOpen(true)} />

          {/* Main scrollable layout viewport */}
          <main className="flex-grow p-6 md:p-8 bg-[#020C1B] text-white overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
