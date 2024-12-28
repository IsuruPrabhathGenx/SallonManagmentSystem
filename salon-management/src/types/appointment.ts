// src/types/appointment.ts
export interface Appointment {
    id?: string;
    customerId: string;
    customerName: string;
    employeeId: string;
    employeeName: string;
    serviceId: string;
    serviceName: string;
    servicePrice: number;
    serviceDuration: number;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
  }