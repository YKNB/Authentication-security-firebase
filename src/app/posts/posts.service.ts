import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Post {
  id?: string;
  title: string;
  content: string;
  updatedAt?: any;
  updatedBy?: string;
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  private firestore = inject(Firestore);
  private postsCol = collection(this.firestore, 'posts');

  getPosts(): Observable<Post[]> {
    return collectionData(this.postsCol, { idField: 'id' }) as Observable<Post[]>;
  }

  addPost(title: string, content: string, updatedBy: string) {
    return addDoc(this.postsCol, {
      title,
      content,
      updatedBy,
      updatedAt: serverTimestamp(),
    });
  }

  updatePost(id: string, patch: Partial<Post>) {
    return updateDoc(doc(this.firestore, `posts/${id}`), {
      ...patch,
      updatedAt: serverTimestamp(),
    });
  }

  deletePost(id: string) {
    return deleteDoc(doc(this.firestore, `posts/${id}`));
  }
}
