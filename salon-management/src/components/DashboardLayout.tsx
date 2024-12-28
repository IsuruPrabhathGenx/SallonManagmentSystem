// src/components/DashboardLayout.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useState } from 'react';
import { LayoutDashboard, Calendar, Users, Scissors, LogOut, Menu, Bell, ChevronDown, UserCircle2 } from 'lucide-react';

export default function DashboardLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 const { user } = useAuth();
 const [isSidebarOpen, setSidebarOpen] = useState(false);

 const menuItems = [
   { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
   { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
   { href: '/dashboard/customers', label: 'Customers', icon: Users },
   { href: '/dashboard/employees', label: 'Employees', icon: UserCircle2 },
   { href: '/dashboard/services', label: 'Services', icon: Scissors },

 ];

 return (
   <div className="min-h-screen bg-gray-50">
     {/* Sidebar */}
     <aside className={`fixed inset-y-0 z-50 flex w-72 flex-col bg-white shadow-lg transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
       <div className="flex h-16 items-center justify-between px-6 border-b">
         <h2 className="text-2xl font-bold text-gray-800">Salon</h2>
         <button className="md:hidden" onClick={() => setSidebarOpen(false)}>×</button>
       </div>
       
       <nav className="flex-1 space-y-1 p-4">
         {menuItems.map((item) => {
           const Icon = item.icon;
           return (
             <Link
               key={item.href}
               href={item.href}
               className="flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100"
             >
               <Icon className="h-5 w-5" />
               <span>{item.label}</span>
             </Link>
           );
         })}
         
         <button
           onClick={() => signOut(auth)}
           className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100"
         >
           <LogOut className="h-5 w-5" />
           <span>Logout</span>
         </button>
       </nav>
     </aside>

     {/* Main Content */}
     <div className="md:pl-72">
       {/* Header */}
       <header className="sticky top-0 z-40 bg-white shadow-sm">
         <div className="flex h-16 items-center justify-between px-4 md:px-6">
           <button
             onClick={() => setSidebarOpen(true)}
             className="rounded p-2 hover:bg-gray-100 md:hidden"
           >
             <Menu className="h-6 w-6" />
           </button>

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