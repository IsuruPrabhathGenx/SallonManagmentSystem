export interface InventoryItem {
    id?: string;
    code: string;
    name: string;
    quantity: number;
    minQuantity?: number;
    unit?: string;
    category?: string;
    brand?: string;
    price?: number;
    details?: string;
    location?: string;
    createdAt: Date;
    updatedAt: Date;
  }