// src/services/serviceService.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore';
import { Service } from '@/types/service';

const COLLECTION = 'services';

export const serviceService = {
  async create(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = Timestamp.now();
    return addDoc(collection(db, COLLECTION), {
      ...service,
      createdAt: now,
      updatedAt: now
    });
  },

  async update(id: string, service: Partial<Omit<Service, 'id' | 'createdAt'>>) {
    const ref = doc(db, COLLECTION, id);
    return updateDoc(ref, {
      ...service,
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
    })) as Service[];
  }
};