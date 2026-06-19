'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { AdminSidebar } from '../../components/AdminSidebar';
import { AdminNavbar } from '../../components/AdminNavbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN', 'EDITOR']}>
      <div className="min-h-screen flex bg-[#020C1B]">
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
