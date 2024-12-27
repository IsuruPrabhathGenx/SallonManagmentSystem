// src/components/DashboardLayout.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white w-64 ${isSidebarOpen ? '' : 'hidden'} md:block`}>
        <div className="p-4">
          <h2 className="text-2xl font-bold">Salon Management</h2>
          <div className="mt-8 space-y-4">
            <Link href="/dashboard" className="block hover:bg-gray-700 p-2 rounded">
              Dashboard
            </Link>
            <Link href="/dashboard/appointments" className="block hover:bg-gray-700 p-2 rounded">
              Appointments
            </Link>
            <Link href="/dashboard/customers" className="block hover:bg-gray-700 p-2 rounded">
              Customers
            </Link>
            <Link href="/dashboard/services" className="block hover:bg-gray-700 p-2 rounded">
              Services
            </Link>
            <button
              onClick={() => signOut(auth)}
              className="w-full text-left hover:bg-gray-700 p-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-4 py-6">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="md:hidden"
            >
              ☰
            </button>
            <div>Welcome, {user?.email}</div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}