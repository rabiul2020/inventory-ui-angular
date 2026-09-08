import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  //router:Router;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      userNameOrEmail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const request: LoginRequest = {
      userNameOrEmail: this.loginForm.value.userNameOrEmail,
      password: this.loginForm.value.password
    };

    this.authService.login(request).subscribe({
      next: (response) => {

  this.loading = false;

  if (response.success && response.data) {

    this.authService.saveLoginData(response.data);

    console.log('Login successful.');

     this.router.navigate(['/dashboard']);

  } else {

    this.errorMessage =
      response.message || 'Login failed.';
     }
  },
      error: (error) => {

        this.loading = false;

        console.error('Login error:', error);

        this.errorMessage =
          error?.error?.message ||
          'Login failed. Please check your username and password.';
      }
    });
  }
}
