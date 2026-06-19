'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Menu, ChevronRight, LogOut } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onMenuToggle: () => void;
}

export const AdminNavbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(p => p);
    return paths.map((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/');
      const label = path.charAt(0).toUpperCase() + path.slice(1);
      const isLast = index === paths.length - 1;

      return {
        label,
        href,
        isLast,
      };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-[#0A192F]/90 backdrop-blur border-b border-white/5 text-white">
      {/* Left section: menu toggle + breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-2 text-xs md:text-sm font-medium text-gray-400">
          <Link href="/admin" className="hover:text-white transition-colors">
            Intelligen
          </Link>
          {breadcrumbs.map((crumb) => (
            <React.Fragment key={crumb.href}>
              <ChevronRight className="h-4 w-4 text-gray-600" />
              {crumb.isLast ? (
                <span className="text-secondary font-semibold">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-white transition-colors">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right section: User Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 focus:outline-none transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-[#020C1B] border border-secondary/20">
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <span className="hidden md:inline-block text-sm font-medium truncate max-w-[120px] text-gray-200">
            {user?.name}
          </span>
        </button>

        {/* User Dropdown Options Overlay */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-lg bg-[#0A192F] border border-white/10 shadow-xl py-1 text-gray-200 divide-y divide-white/5">
            <div className="px-4 py-3">
              <p className="text-xs text-gray-400 font-medium">Logged in as</p>
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/20 text-secondary uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
            
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-red-500/10 hover:text-red-400 text-left transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminNavbar;
