import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PostsService } from '../../posts/posts.service';
import { AuthService } from '../auth.service';

@Component({
  standalone: true,
  selector: 'app-posts',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <header style="display:flex; gap:12px; align-items:center;">
      <h2>Posts</h2>
      <span *ngIf="auth.userSig() as u">({{ auth.roleSig() }} | {{ u.email }})</span>
      <button (click)="logout()">Logout</button>
      <a *ngIf="auth.isAdmin()" routerLink="/admin">Admin</a>
    </header>

    <section *ngIf="auth.isModerator(); else readOnly" style="margin:16px 0;">
      <h3>Create / Update (Moderator+)</h3>
      <form [formGroup]="form" (ngSubmit)="create()">
        <input placeholder="Title" formControlName="title" />
        <input placeholder="Content" formControlName="content" />
        <button [disabled]="form.invalid">Add post</button>
      </form>
      <p *ngIf="error" style="color:red">{{ error }}</p>
    </section>

    <ng-template #readOnly>
      <p>Read-only mode (user)</p>
    </ng-template>

    <hr />

    <div *ngFor="let p of posts$ | async" style="padding:8px 0;">
      <b>{{ p.title }}</b> - {{ p.content }}

      <span *ngIf="auth.isModerator()" style="margin-left:10px;">
        <button (click)="quickEdit(p.id!, p.title + ' ✅')">Edit</button>
      </span>

      <span *ngIf="auth.isAdmin()" style="margin-left:10px;">
        <button (click)="remove(p.id!)">Delete</button>
      </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Posts {
  postsService = inject(PostsService);
  auth = inject(AuthService);
  fb = inject(FormBuilder);

  posts$ = this.postsService.getPosts();
  error = '';

  form = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
  });

  async create() {
    this.error = '';
    const u = this.auth.userSig();
    if (!u) return;

    try {
      const { title, content } = this.form.getRawValue();
      await this.postsService.addPost(title!, content!, u.uid);
      this.form.reset();
    } catch (e: any) {
      this.error = e?.message ?? 'Write denied';
    }
  }

  async quickEdit(id: string, newTitle: string) {
    this.error = '';
    try {
      await this.postsService.updatePost(id, { title: newTitle });
    } catch (e: any) {
      this.error = e?.message ?? 'Update denied';
    }
  }

  async remove(id: string) {
    this.error = '';
    try {
      await this.postsService.deletePost(id);
    } catch (e: any) {
      this.error = e?.message ?? 'Delete denied';
    }
  }

  logout() {
    this.auth.logout();
  }
}