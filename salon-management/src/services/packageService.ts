import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore';
import { Package } from '@/types/bridal';

const COLLECTION = 'packages';

export const packageService = {
  async create(pkg: Omit<Package, 'id'>) {
    const now = Timestamp.now();
    return addDoc(collection(db, COLLECTION), {
      ...pkg,
      createdAt: now,
      updatedAt: now
    });
  },

  async update(id: string, pkg: Partial<Omit<Package, 'id'>>) {
    const ref = doc(db, COLLECTION, id);
    return updateDoc(ref, {
      ...pkg,
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
    })) as Package[];
  }
};