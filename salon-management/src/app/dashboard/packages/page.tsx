'use client';

import { useState, useEffect } from 'react';
import { packageService } from '@/services/packageService';
import { Package } from '@/types/bridal';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import AddPackageModal from './AddPackageModal';
import EditPackageModal from './EditPackageModal';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      await packageService.delete(id);
      await loadPackages();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bridal Packages</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Package
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
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {packages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{pkg.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${pkg.price}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{pkg.description || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => pkg.id && handleDelete(pkg.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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
        <AddPackageModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadPackages();
          }}
        />
      )}

      {showEditModal && selectedPackage && (
        <EditPackageModal
          package={selectedPackage}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPackage(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedPackage(null);
            loadPackages();
          }}
        />
      )}
    </DashboardLayout>
  );
}