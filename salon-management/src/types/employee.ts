// src/types/employee.ts
export interface Employee {
    id?: string;
    name: string;
    mobile: string;
    whatsapp?: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }