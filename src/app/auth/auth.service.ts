import { Injectable, inject, signal, computed } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc, serverTimestamp, docData } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of, map } from 'rxjs';

export type Role = 'user' | 'moderator' | 'admin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // Observable Firebase user
  firebaseUser$ = user(this.auth);

  // Signal user (zoneless-friendly)
  userSig = toSignal(this.firebaseUser$, { initialValue: null });

  // Observable role
  role$ = this.firebaseUser$.pipe(
    switchMap(u => {
      if (!u) return of(null);
      return docData(doc(this.firestore, `users/${u.uid}`)).pipe(
        map((d: any) => (d?.role ?? 'user') as Role)
      );
    })
  );

  // Signal role
  roleSig = toSignal(this.role$, { initialValue: null });

  // Helpers (signals)
  isLoggedIn = computed(() => !!this.userSig());
  isAdmin = computed(() => this.roleSig() === 'admin');
  isModerator = computed(() => {
    const r = this.roleSig();
    return r === 'moderator' || r === 'admin';
  });

  async register(email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);

    // Crée le profil Firestore avec role 'user'
    await setDoc(doc(this.firestore, `users/${cred.user.uid}`), {
      email,
      role: 'user',
      createdAt: serverTimestamp(),
    }, { merge: true });

    return cred.user;
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
