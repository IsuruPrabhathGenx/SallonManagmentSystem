import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore';
import { Bridal, Payment } from '@/types/bridal';

const COLLECTION = 'bridals';

interface FirestorePayment extends Omit<Payment, 'date'> {
  date: Timestamp;
}

interface FirestoreBridal extends Omit<Bridal, 'date' | 'payments' | 'createdAt' | 'updatedAt'> {
  date: Timestamp;
  payments: FirestorePayment[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const bridalService = {
  async create(bridal: Omit<Bridal, 'id' | 'createdAt' | 'updatedAt' | 'totalPaid' | 'totalDue' | 'status'>) {
    const now = Timestamp.now();
    const totalPaid = bridal.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalDue = bridal.packagePrice - totalPaid;
    
    return addDoc(collection(db, COLLECTION), {
      ...bridal,
      totalPaid,
      totalDue,
      status: totalDue > 0 ? 'pending' : 'paid',
      date: Timestamp.fromDate(bridal.date),
      payments: bridal.payments.map(payment => ({
        ...payment,
        date: Timestamp.fromDate(payment.date)
      })),
      createdAt: now,
      updatedAt: now
    });
  },

  async update(id: string, bridal: Partial<Omit<Bridal, 'id' | 'createdAt'>>) {
    const ref = doc(db, COLLECTION, id);
    const updateData = {
      ...bridal,
      updatedAt: Timestamp.now(),
      ...(bridal.date && { date: Timestamp.fromDate(bridal.date) })
    };
    return updateDoc(ref, updateData);
  },

  async addPayment(id: string, payment: Omit<Payment, 'id'>) {
    const ref = doc(db, COLLECTION, id);
    const snapshot = await getDocs(collection(db, COLLECTION));
    const bridalDoc = snapshot.docs.find(doc => doc.id === id);
    
    if (!bridalDoc) throw new Error('Bridal not found');

    const bridalData = bridalDoc.data() as FirestoreBridal;
    const newPayments = [...bridalData.payments, { ...payment, date: Timestamp.fromDate(payment.date) }];
    const totalPaid = newPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalDue = bridalData.packagePrice - totalPaid;

    return updateDoc(ref, {
      payments: newPayments,
      totalPaid,
      totalDue,
      status: totalDue > 0 ? 'pending' : 'paid',
      updatedAt: Timestamp.now()
    });
  },

  async delete(id: string) {
    return deleteDoc(doc(db, COLLECTION, id));
  },

  async getAll(): Promise<Bridal[]> {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map(doc => {
      const data = doc.data() as FirestoreBridal;
      return {
        id: doc.id,
        name: data.name,
        packageId: data.packageId,
        packageName: data.packageName,
        packagePrice: data.packagePrice,
        totalPaid: data.totalPaid,
        totalDue: data.totalDue,
        status: data.status,
        notes: data.notes,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        payments: data.payments.map((payment: FirestorePayment) => ({
          id: payment.id,
          amount: payment.amount,
          paymentMethod: payment.paymentMethod,
          notes: payment.notes,
          date: payment.date.toDate()
        }))
      };
    });
  }
};