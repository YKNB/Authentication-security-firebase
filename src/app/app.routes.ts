import { Routes } from '@angular/router';
import { roleGuard } from './auth/role.guard';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Posts } from './auth/posts/posts';
import { Admin } from './admin/admin/admin';
import { Forbidden } from './shared/forbidden';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forbidden', component: Forbidden },

  { path: 'posts', component: Posts, canMatch: [roleGuard(['user', 'moderator', 'admin'])] },
  { path: 'admin', component: Admin, canMatch: [roleGuard(['admin'])] },

  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: '**', redirectTo: 'posts' },
];
