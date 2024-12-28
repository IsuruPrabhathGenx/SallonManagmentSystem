// src/app/dashboard/appointments/AddAppointmentModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { appointmentService } from '@/services/appointmentService';
import { customerService } from '@/services/customerService';
import { employeeService } from '@/services/employeeService';
import { serviceService } from '@/services/serviceService';
import { Customer } from '@/types/customer';
import { Employee } from '@/types/employee';
import { Service } from '@/types/service';
import { X, Search, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface AddAppointmentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddAppointmentModal({ onClose, onSuccess }: AddAppointmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    employeeId: '',
    employeeName: '',
    serviceId: '',
    serviceName: '',
    servicePrice: 0,
    serviceDuration: 0,
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm")
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [customersData, employeesData, servicesData] = await Promise.all([
        customerService.getAll(),
        employeeService.getAll(),
        serviceService.getAll()
      ]);
      setCustomers(customersData);
      setEmployees(employeesData);
      setServices(servicesData);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.mobile.includes(customerSearch)
  );

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    employee.mobile.includes(employeeSearch)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await appointmentService.create({
      ...formData,
      date: new Date(formData.date)
    });
    onSuccess();
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
          <h2 className="text-xl font-bold">Add New Appointment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer *</label>
            <div className="mt-1 relative">
              <div className="relative">
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2"
                  placeholder="Search customer..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {customerSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          customerId: customer.id!,
                          customerName: customer.name
                        }));
                        setCustomerSearch('');
                      }}
                    >
                      <div>{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.mobile}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {formData.customerName && (
              <div className="mt-2 p-2 bg-gray-50 rounded-md flex justify-between items-center">
                <span>{formData.customerName}</span>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setFormData(prev => ({ ...prev, customerId: '', customerName: '' }))}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Employee Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee *</label>
            <div className="mt-1 relative">
              <div className="relative">
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2"
                  placeholder="Search employee..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {employeeSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredEmployees.map((employee) => (
                    <button
                      key={employee.id}
                      type="button"
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          employeeId: employee.id!,
                          employeeName: employee.name
                        }));
                        setEmployeeSearch('');
                      }}
                    >
                      <div>{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.mobile}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {formData.employeeName && (
              <div className="mt-2 p-2 bg-gray-50 rounded-md flex justify-between items-center">
                <span>{formData.employeeName}</span>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setFormData(prev => ({ ...prev, employeeId: '', employeeName: '' }))}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Service *</label>
            <select
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.serviceId}
              onChange={(e) => {
                const service = services.find(s => s.id === e.target.value);
                if (service) {
                  setFormData(prev => ({
                    ...prev,
                    serviceId: service.id!,
                    serviceName: service.name,
                    servicePrice: service.price,
                    serviceDuration: service.duration
                  }));
                }
              }}
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.price} - {service.duration} mins
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date and Time *</label>
            <input
              type="datetime-local"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
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
              Add Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}