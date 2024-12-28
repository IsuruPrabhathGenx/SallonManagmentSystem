// src/types/customer.ts
export interface Customer {
    id?: string;
    name: string;
    mobile: string;
    profession?: string;
    whatsapp?: string;
    createdAt: Date;
    updatedAt: Date;
  }