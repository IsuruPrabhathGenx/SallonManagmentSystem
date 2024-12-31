'use client';

import { useState, useEffect } from 'react';
import { inventoryService } from '@/services/inventoryService';
import { InventoryItem } from '@/types/inventory';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Pencil, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import AddInventoryModal from './AddInventoryModal';
import EditInventoryModal from './EditInventoryModal';

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getAll();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await inventoryService.delete(id);
      await loadInventory();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Inventory</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Item
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
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Code</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Unit</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Brand</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id} className={item.quantity <= (item.minQuantity || 0) ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className={item.quantity <= (item.minQuantity || 0) ? 'text-red-600' : 'text-gray-900'}>
                            {item.quantity}
                          </span>
                          {item.quantity <= (item.minQuantity || 0) && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.unit || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.category || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.brand || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.price ? `$${item.price.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => item.id && handleDelete(item.id)}
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
        <AddInventoryModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadInventory();
          }}
        />
      )}

      {showEditModal && selectedItem && (
        <EditInventoryModal
          item={selectedItem}
          onClose={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedItem(null);
            loadInventory();
          }}
        />
      )}
    </DashboardLayout>
  );
}