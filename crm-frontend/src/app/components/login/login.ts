import { Component, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = signal('');
  password = signal('');
  errorMessage = signal('');
  loading = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  submit(): void {
    this.errorMessage.set('');
    this.loading.set(true);

    this.auth.login(this.username(), this.password()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/contacts']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        if (err.status === 401) {
          this.errorMessage.set('Invalid username or password');
        } else if (err.status === 0) {
          this.errorMessage.set('Cannot reach the server. Is the backend running?');
        } else {
          this.errorMessage.set(err.error?.message ?? 'Something went wrong');
        }
      }
    });
  }
}