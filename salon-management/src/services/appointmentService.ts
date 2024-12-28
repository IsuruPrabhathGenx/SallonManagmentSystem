// src/services/appointmentService.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, Timestamp, query, where } from 'firebase/firestore';
import { Appointment } from '@/types/appointment';

const COLLECTION = 'appointments';

export const appointmentService = {
  async create(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = Timestamp.now();
    return addDoc(collection(db, COLLECTION), {
      ...appointment,
      date: Timestamp.fromDate(appointment.date),
      createdAt: now,
      updatedAt: now
    });
  },

  async update(id: string, appointment: Partial<Omit<Appointment, 'id' | 'createdAt'>>) {
    const ref = doc(db, COLLECTION, id);
    const updateData = {
      ...appointment,
      updatedAt: Timestamp.now(),
      ...(appointment.date && { date: Timestamp.fromDate(appointment.date) })
    };
    return updateDoc(ref, updateData);
  },

  async delete(id: string) {
    return deleteDoc(doc(db, COLLECTION, id));
  },

  async getAll() {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    })) as Appointment[];
  },

  async getByDateRange(startDate: Date, endDate: Date) {
    const q = query(
      collection(db, COLLECTION),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate))
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    })) as Appointment[];
  }
};