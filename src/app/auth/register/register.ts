import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <h2>Register</h2>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <input placeholder="Email" formControlName="email" />
      <input placeholder="Password" type="password" formControlName="password" />
      <button [disabled]="form.invalid || loading">Create account</button>
    </form>

    <p *ngIf="error" style="color:red">{{ error }}</p>
    <a routerLink="/login">Déjà un compte ? Login</a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async submit() {
    this.error = '';
    if (this.form.invalid) return;

    this.loading = true;
    try {
      const { email, password } = this.form.getRawValue();
      await this.auth.register(email!, password!);
      await this.router.navigate(['/posts']);
    } catch (e: any) {
      this.error = e?.message ?? 'Registration error';
    } finally {
      this.loading = false;
    }
  }
}