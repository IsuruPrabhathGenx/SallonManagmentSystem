// src/app/dashboard/services/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { serviceService } from '@/services/serviceService';
import { Service } from '@/types/service';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import AddServiceModal from './AddServiceModal';
import EditServiceModal from './EditServiceModal';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await serviceService.getAll();
      setServices(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      await serviceService.delete(id);
      await loadServices();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Services</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Duration</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{service.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${service.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{service.duration} mins</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{service.description || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedService(service);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => service.id && handleDelete(service.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddServiceModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadServices();
          }}
        />
      )}

      {showEditModal && selectedService && (
        <EditServiceModal
          service={selectedService}
          onClose={() => {
            setShowEditModal(false);
            setSelectedService(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedService(null);
            loadServices();
          }}
        />
      )}
    </DashboardLayout>
  );
}