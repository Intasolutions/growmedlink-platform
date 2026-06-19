import React from 'react';
import Link from 'next/link';
import { Settings, FileText, Shield, PenTool } from 'lucide-react';

const pagesList = [
  {
    key: 'about',
    title: 'About Us',
    icon: <Settings className="h-6 w-6 text-blue-400" />,
    description: 'Manage the company description, mission, and team details.',
  },
  {
    key: 'privacy',
    title: 'Privacy Policy',
    icon: <Shield className="h-6 w-6 text-green-400" />,
    description: 'Update the privacy policy regarding data collection and usage.',
  },
  {
    key: 'terms',
    title: 'Terms & Conditions',
    icon: <FileText className="h-6 w-6 text-purple-400" />,
    description: 'Edit the legal terms and conditions of service.',
  },
];

export default function AdminPagesList() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">System Pages</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage core static content pages like About, Privacy, and Terms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagesList.map((page) => (
          <div
            key={page.key}
            className="bg-[#0A192F] border border-[#1E2D3D] rounded-xl p-6 flex flex-col justify-between hover:border-secondary transition-colors"
          >
            <div className="space-y-4">
              <div className="h-12 w-12 bg-[#020C1B] rounded-lg flex items-center justify-center border border-white/5">
                {page.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{page.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{page.description}</p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5">
              <Link
                href={`/admin/pages/${page.key}`}
                className="inline-flex items-center gap-2 text-sm text-secondary hover:text-white transition-colors"
              >
                <PenTool className="h-4 w-4" />
                Edit Content
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
