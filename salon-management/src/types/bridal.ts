export interface Package {
    id: string;
    name: string;
    price: number;
    description?: string;
  }
  
  export interface Payment {
    id?: string;
    amount: number;
    date: Date;
    paymentMethod?: string;
    notes?: string;
  }
  
  export interface Bridal {
    id?: string;
    name: string;
    date: Date;
    packageId: string;
    packageName: string;
    packagePrice: number;
    totalPaid: number;
    totalDue: number;
    status: 'pending' | 'paid';
    payments: Payment[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
  }