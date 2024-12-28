// src/services/customerService.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore';
import { Customer } from '@/types/customer';

const COLLECTION = 'customers';

export const customerService = {
  async create(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = Timestamp.now();
    return addDoc(collection(db, COLLECTION), {
      ...customer,
      createdAt: now,
      updatedAt: now
    });
  },

  async update(id: string, customer: Partial<Omit<Customer, 'id' | 'createdAt'>>) {
    const ref = doc(db, COLLECTION, id);
    return updateDoc(ref, {
      ...customer,
      updatedAt: Timestamp.now()
    });
  },

  async delete(id: string) {
    return deleteDoc(doc(db, COLLECTION, id));
  },

  async getAll() {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Customer[];
  }
};