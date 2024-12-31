'use client';

import { useState, useEffect } from 'react';
import { bridalService } from '@/services/bridalService';
import { Bridal } from '@/types/bridal';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Pencil, CreditCard, Loader2 } from 'lucide-react';
import AddBridalModal from './AddBridalModal';
import EditBridalModal from './EditBridalModal';
import AddPaymentModal from './AddPaymentModal';
import { format } from 'date-fns';

export default function BridalsPage() {
  const [bridals, setBridals] = useState<Bridal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBridal, setSelectedBridal] = useState<Bridal | null>(null);

  useEffect(() => {
    loadBridals();
  }, []);

  const loadBridals = async () => {
    try {
      setLoading(true);
      const data = await bridalService.getAll();
      setBridals(data.sort((a, b) => b.date.getTime() - a.date.getTime()));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bridals</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Bridal
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Package</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Total Price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Paid</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Due</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bridals.map((bridal) => (
                    <tr key={bridal.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{bridal.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{format(bridal.date, 'PPP')}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{bridal.packageName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${bridal.packagePrice}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${bridal.totalPaid}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className={bridal.totalDue > 0 ? 'text-red-600' : 'text-green-600'}>
                          ${bridal.totalDue}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bridal.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {bridal.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedBridal(bridal);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {bridal.totalDue > 0 && (
                          <button
                            onClick={() => {
                              setSelectedBridal(bridal);
                              setShowPaymentModal(true);
                            }}
                            className="text-green-600 hover:text-green-800"
                          >
                            <CreditCard className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddBridalModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadBridals();
          }}
        />
      )}

      {showEditModal && selectedBridal && (
        <EditBridalModal
          bridal={selectedBridal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBridal(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedBridal(null);
            loadBridals();
          }}
        />
      )}

      {showPaymentModal && selectedBridal && (
        <AddPaymentModal
          bridal={selectedBridal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedBridal(null);
          }}
          onSuccess={() => {
            setShowPaymentModal(false);
            setSelectedBridal(null);
            loadBridals();
          }}
        />
      )}
    </DashboardLayout>
  );
}