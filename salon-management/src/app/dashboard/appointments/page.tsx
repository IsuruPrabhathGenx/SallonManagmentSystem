// src/app/dashboard/appointments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { appointmentService } from '@/services/appointmentService';
import { Appointment } from '@/types/appointment';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import AddAppointmentModal from './AddAppointmentModal';
import EditAppointmentModal from './EditAppointmentModal';
import { format } from 'date-fns';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAll();
      setAppointments(data.sort((a, b) => b.date.getTime() - a.date.getTime()));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      await appointmentService.delete(id);
      await loadAppointments();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Appointments</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Appointment
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
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date & Time</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Employee</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Service</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {format(appointment.date, 'PPp')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{appointment.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{appointment.employeeName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>{appointment.serviceName}</div>
                      <div className="text-sm text-gray-500">
                        ${appointment.servicePrice} • {appointment.serviceDuration} mins
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => appointment.id && handleDelete(appointment.id)}
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
        <AddAppointmentModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadAppointments();
          }}
        />
      )}

      {showEditModal && selectedAppointment && (
        <EditAppointmentModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAppointment(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedAppointment(null);
            loadAppointments();
          }}
        />
      )}
    </DashboardLayout>
  );
}