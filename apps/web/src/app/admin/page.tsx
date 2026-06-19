'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, FileText, Image, Inbox, UserCheck } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    { name: 'Total Services', value: '12', icon: Briefcase, color: 'text-blue-400', desc: 'Active immigration & language offerings' },
    { name: 'Blog Articles', value: '34', icon: FileText, color: 'text-green-400', desc: 'Published educational articles & news' },
    { name: 'Active Leads', value: '188', icon: Inbox, color: 'text-secondary', desc: 'Unresolved enquiries & expert consults' },
    { name: 'Media Files', value: '89', icon: Image, color: 'text-purple-400', desc: 'Cloudinary storage assets logs' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-[#0A192F]/40 border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-black tracking-wide text-white">
            Welcome back, {user?.name || 'Administrator'}!
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-light">
            Access, publish, and monitor details for growmedlink-intelligen academy platform.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary/15 border border-secondary/20 rounded-xl text-secondary text-sm font-semibold shrink-0 self-start sm:self-center">
          <UserCheck className="h-4 w-4" />
          <span className="uppercase tracking-wider text-xs">{user?.role} Mode</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-[#0A192F]/30 hover:bg-[#0A192F]/50 border border-white/5 rounded-2xl p-6 transition-all duration-300 group hover:-translate-y-0.5"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl font-black text-white group-hover:text-secondary transition-colors">
                  {stat.value}
                </span>
                <div className={`p-2.5 bg-white/5 rounded-xl border border-white/10 group-hover:border-secondary/20 transition-all`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-200 tracking-wide">{stat.name}</h3>
              <p className="text-xs text-gray-400 mt-1 font-light leading-relaxed">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Grid for placeholder widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent leads card placeholder */}
        <div className="lg:col-span-2 bg-[#0A192F]/20 border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <h2 className="text-base font-bold text-white tracking-wide">Recent Lead Enquiries</h2>
            <span className="text-xs font-medium text-secondary hover:underline cursor-pointer">View All</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3.5 bg-[#020C1B]/60 border border-white/5 rounded-xl text-sm">
              <div className="space-y-1">
                <p className="font-semibold text-white">Sarah Jenkins</p>
                <p className="text-xs text-gray-400">sarah@gmail.com | Student Visa Consultation</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-500 rounded border border-amber-500/15 uppercase">
                Pending
              </span>
            </div>
            <div className="flex justify-between items-center p-3.5 bg-[#020C1B]/60 border border-white/5 rounded-xl text-sm">
              <div className="space-y-1">
                <p className="font-semibold text-white">David Miller</p>
                <p className="text-xs text-gray-400">david.m@yahoo.com | IELTS General Coaching</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 text-accent rounded border border-accent/15 uppercase">
                In Progress
              </span>
            </div>
          </div>
        </div>

        {/* System Activity Overview logs placeholder */}
        <div className="bg-[#0A192F]/20 border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <h2 className="text-base font-bold text-white tracking-wide">CMS System Logs</h2>
            <span className="text-xs font-medium text-secondary hover:underline cursor-pointer">View Logs</span>
          </div>
          <div className="space-y-3.5">
            <div className="text-xs leading-relaxed text-gray-300 bg-[#020C1B]/40 p-3 rounded-lg border border-white/5 flex gap-2.5 items-start">
              <span className="font-bold text-secondary text-[10px] uppercase tracking-wider bg-secondary/10 px-1.5 py-0.5 rounded border border-secondary/15 mt-0.5">
                Auth
              </span>
              <div>
                <p className="font-semibold text-white">Super Admin Logged In</p>
                <p className="text-gray-400 text-[10px] mt-0.5">Just now | 192.168.1.1</p>
              </div>
            </div>
            <div className="text-xs leading-relaxed text-gray-300 bg-[#020C1B]/40 p-3 rounded-lg border border-white/5 flex gap-2.5 items-start">
              <span className="font-bold text-green-400 text-[10px] uppercase tracking-wider bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/15 mt-0.5">
                Media
              </span>
              <div>
                <p className="font-semibold text-white">Image uploaded: header_bg.png</p>
                <p className="text-gray-400 text-[10px] mt-0.5">2 hours ago | by Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
