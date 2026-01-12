import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <h2>Login</h2>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <input placeholder="Email" formControlName="email" />
      <input placeholder="Password" type="password" formControlName="password" />
      <button [disabled]="form.invalid || loading">Login</button>
    </form>

    <p *ngIf="error" style="color:red">{{ error }}</p>
    <a routerLink="/register">Créer un compte</a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async submit() {
    this.error = '';
    if (this.form.invalid) return;

    this.loading = true;
    try {
      const { email, password } = this.form.getRawValue();
      await this.auth.login(email!, password!);
      await this.router.navigate(['/posts']);
    } catch (e: any) {
      this.error = e?.message ?? 'Login error';
    } finally {
      this.loading = false;
    }
  }
}