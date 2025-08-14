// Lightweight client-side notification service shim for mobile parity.
// On web, this is more elaborate. Here we only expose the createNotification API
// used by flows that might be shared in the future.

import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default class NotificationService {
  async createNotification(
    userId: string,
    userType: 'user' | 'advertiser',
    type: string,
    title: string,
    message: string,
    url?: string,
    data?: Record<string, any>
  ): Promise<void> {
    await addDoc(collection(db, 'notifications'), {
      userId,
      userType,
      type,
      title,
      message,
      url: url || null,
      data: data || {},
      read: false,
      createdAt: serverTimestamp()
    });
  }
}


