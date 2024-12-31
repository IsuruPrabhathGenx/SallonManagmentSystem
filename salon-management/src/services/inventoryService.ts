import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore';
import { InventoryItem } from '@/types/inventory';

const COLLECTION = 'inventory';

export const inventoryService = {
  async create(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = Timestamp.now();
    return addDoc(collection(db, COLLECTION), {
      ...item,
      createdAt: now,
      updatedAt: now
    });
  },

  async update(id: string, item: Partial<Omit<InventoryItem, 'id' | 'createdAt'>>) {
    const ref = doc(db, COLLECTION, id);
    return updateDoc(ref, {
      ...item,
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
    })) as InventoryItem[];
  }
};