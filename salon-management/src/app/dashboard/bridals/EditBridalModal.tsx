'use client';

import { useState, useEffect } from 'react';
import { bridalService } from '@/services/bridalService';
import { packageService } from '@/services/packageService';
import { Bridal, Package } from '@/types/bridal';
import { X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface EditBridalModalProps {
  bridal: Bridal;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBridalModal({ bridal, onClose, onSuccess }: EditBridalModalProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: bridal.name,
    date: format(bridal.date, 'yyyy-MM-dd'),
    packageId: bridal.packageId,
    packageName: bridal.packageName,
    packagePrice: bridal.packagePrice,
    notes: bridal.notes || ''
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await packageService.getAll();
      setPackages(data);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageChange = (packageId: string) => {
    const selectedPackage = packages.find(p => p.id === packageId);
    if (selectedPackage) {
      setFormData(prev => ({
        ...prev,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        packagePrice: selectedPackage.price
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bridal.id) {
      await bridalService.update(bridal.id, {
        name: formData.name,
        date: new Date(formData.date),
        packageId: formData.packageId,
        packageName: formData.packageName,
        packagePrice: formData.packagePrice,
        notes: formData.notes
      });
      onSuccess();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-md my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Bridal</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Total Paid</p>
              <p className="font-medium">${bridal.totalPaid}</p>
            </div>
            <div>
              <p className="text-gray-500">Amount Due</p>
              <p className="font-medium text-red-600">${bridal.totalDue}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date *</label>
            <input
              type="date"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Package *</label>
            <select
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.packageId}
              onChange={(e) => handlePackageChange(e.target.value)}
            >
              <option value="">Select a package</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} - ${pkg.price}
                </option>
              ))}
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}