// src/app/dashboard/page.tsx
'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return null;

  const stats = [
    { label: 'Total Customers', value: '2,345', icon: Users, trend: '+12%' },
    { label: 'Appointments Today', value: '12', icon: Calendar, trend: '+5%' },
    { label: 'Revenue Today', value: '$1,234', icon: DollarSign, trend: '+8%' },
    { label: 'Monthly Growth', value: '22%', icon: TrendingUp, trend: '+2%' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className="rounded-full bg-blue-50 p-3">
                    <Icon className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <p className="mt-2 text-sm text-green-500">{stat.trend} vs last month</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Recent Appointments</h2>
            {/* Add appointments list */}
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Popular Services</h2>
            {/* Add services list */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}