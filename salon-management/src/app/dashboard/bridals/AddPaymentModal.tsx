'use client';

import { useState } from 'react';
import { bridalService } from '@/services/bridalService';
import { Bridal } from '@/types/bridal';
import { X } from 'lucide-react';

interface AddPaymentModalProps {
  bridal: Bridal;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPaymentModal({ bridal, onClose, onSuccess }: AddPaymentModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'cash',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bridal.id) {
      await bridalService.addPayment(bridal.id, {
        amount: Number(formData.amount),
        date: new Date(),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      });
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Bridal Name</p>
              <p className="font-medium">{bridal.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Package</p>
              <p className="font-medium">{bridal.packageName}</p>
            </div>
            <div>
              <p className="text-gray-500">Total Price</p>
              <p className="font-medium">${bridal.packagePrice}</p>
            </div>
            <div>
              <p className="text-gray-500">Amount Due</p>
              <p className="font-medium text-red-600">${bridal.totalDue}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Amount *</label>
            <input
              type="number"
              required
              min="0"
              max={bridal.totalDue}
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.paymentMethod}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="transfer">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Add Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}