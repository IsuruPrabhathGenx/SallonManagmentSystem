// src/types/service.ts
export interface Service {
    id?: string;
    name: string;
    price: number;
    duration: number; // in minutes
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }