import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, AppUser } from '../admin.service';
import { Role } from '../../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [CommonModule, RouterModule],
  template: `
    <h2>Admin Panel</h2>
    <a routerLink="/posts">← Back</a>

    <p *ngIf="error" style="color:red">{{ error }}</p>

    <div *ngFor="let u of users$ | async" style="padding:8px 0;">
      <b>{{ u.email }}</b> | role: {{ u.role }}

      <select [value]="u.role" (change)="changeRole(u, $any($event.target).value)">
        <option value="user">user</option>
        <option value="moderator">moderator</option>
        <option value="admin">admin</option>
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Admin {
  private admin = inject(AdminService);
  users$ = this.admin.getUsers();
  error = '';

  async changeRole(u: AppUser, roleValue: string) {
    this.error = '';
    const role = roleValue as Role;

    // mini safety
    if (!['user', 'moderator', 'admin'].includes(role)) {
      this.error = 'Invalid role';
      return;
    }

    try {
      await this.admin.setRole(u.id, role);
    } catch (e: any) {
      this.error = e?.message ?? 'Role update denied';
    }
  }
}
