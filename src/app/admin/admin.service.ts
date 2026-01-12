import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Role } from '../auth/auth.service';

export interface AppUser {
  id: string; // uid
  email: string;
  role: Role;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private firestore = inject(Firestore);
  private usersCol = collection(this.firestore, 'users');

  getUsers(): Observable<AppUser[]> {
    return collectionData(this.usersCol, { idField: 'id' }) as Observable<AppUser[]>;
  }

  setRole(uid: string, role: Role) {
    return updateDoc(doc(this.firestore, `users/${uid}`), { role });
  }
}
