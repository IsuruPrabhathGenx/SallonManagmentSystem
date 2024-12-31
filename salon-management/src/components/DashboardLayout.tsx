'use client';

import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useState } from 'react';
import { LayoutDashboard, Calendar, Users, Scissors, LogOut, Menu, Bell, Package, ChevronDown, UserCircle2, X } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
    { href: '/dashboard/customers', label: 'Customers', icon: Users },
    { href: '/dashboard/employees', label: 'Employees', icon: UserCircle2 },
    { href: '/dashboard/services', label: 'Services', icon: Scissors },
    { href: '/dashboard/inventory', label: 'Inventory', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
        ${isSidebarOpen ? 'w-72' : 'w-20'}
      `}>
        <div className={`flex h-16 items-center justify-between px-6 border-b ${!isSidebarOpen && 'px-4'}`}>
          <h2 className={`text-2xl font-bold text-gray-800 transition-opacity duration-300 ${!isSidebarOpen && 'md:opacity-0'}`}>
            Salon
          </h2>
          <button 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100
                  ${!isSidebarOpen ? 'justify-center' : 'space-x-3'}
                `}
              >
                <Icon className="h-5 w-5" />
                <span className={`transition-opacity duration-300 ${!isSidebarOpen && 'md:hidden'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          
          <button
            onClick={() => signOut(auth)}
            className={`flex w-full items-center rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100
              ${!isSidebarOpen ? 'justify-center' : 'space-x-3'}
            `}
          >
            <LogOut className="h-5 w-5" />
            <span className={`transition-opacity duration-300 ${!isSidebarOpen && 'md:hidden'}`}>
              Logout
            </span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:pl-72' : 'md:pl-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="rounded p-2 hover:bg-gray-100 md:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Desktop sidebar toggle */}
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="hidden md:flex rounded p-2 hover:bg-gray-100"
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button className="rounded-full p-2 hover:bg-gray-100">
                <Bell className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user?.email}</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}