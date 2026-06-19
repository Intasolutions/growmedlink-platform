'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Image,
  Inbox,
  BookOpen,
  Settings,
  Users,
  X,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const AdminSidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
    },
    {
      name: 'Services',
      path: '/admin/services',
      icon: Briefcase,
      roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
    },
    {
      name: 'Blogs',
      path: '/admin/blogs',
      icon: FileText,
      roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
    },
    {
      name: 'Media Library',
      path: '/admin/media',
      icon: Image,
      roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
    },
    {
      name: 'Enquiries',
      path: '/admin/enquiries',
      icon: Inbox,
      roles: ['SUPER_ADMIN', 'ADMIN'],
    },
    {
      name: 'Pages',
      path: '/admin/pages',
      icon: BookOpen,
      roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
    },
    {
      name: 'Global Settings',
      path: '/admin/settings',
      icon: Settings,
      roles: ['SUPER_ADMIN', 'ADMIN'],
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: Users,
      roles: ['SUPER_ADMIN', 'ADMIN'],
    },
  ];

  const filteredItems = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#020C1B]/80 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#0A192F] border-r border-white/5 transition-transform duration-300 transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between h-16 px-6 bg-[#020C1B] border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-secondary" />
            <span className="font-heading font-bold text-white text-lg tracking-wide">
              Intelligen <span className="text-secondary text-xs block font-light -mt-1">Admin Panel</span>
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-grow px-4 py-6 overflow-y-auto space-y-1">
          {filteredItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-secondary text-[#020C1B] shadow-md shadow-secondary/20 font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-[#020C1B]' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer profile info */}
        <div className="p-4 border-t border-white/5 bg-[#020C1B]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-secondary">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-secondary font-medium uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
