// src/services/employeeService.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore';
import { Employee } from '@/types/employee';

const COLLECTION = 'employees';

export const employeeService = {
  async create(employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = Timestamp.now();
    return addDoc(collection(db, COLLECTION), {
      ...employee,
      createdAt: now,
      updatedAt: now
    });
  },

  async update(id: string, employee: Partial<Omit<Employee, 'id' | 'createdAt'>>) {
    const ref = doc(db, COLLECTION, id);
    return updateDoc(ref, {
      ...employee,
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
    })) as Employee[];
  }
};