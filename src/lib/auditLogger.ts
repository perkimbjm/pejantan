import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

export const logAuditActivity = async (action: AuditAction, module: string, details: string) => {
  try {
    const user = auth.currentUser;
    if (!user) return; // Only log authenticated user actions

    await addDoc(collection(db, 'audit_logs'), {
      timestamp: new Date().toISOString(),
      userId: user.uid,
      userEmail: user.email || 'Unknown',
      action,
      module,
      details
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};
