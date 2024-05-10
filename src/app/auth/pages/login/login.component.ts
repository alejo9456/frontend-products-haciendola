import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  hide = true;

  myForm: UntypedFormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  get email() {
    return this.myForm.get('email');
  }
  getErrorMessage() {
    if (this.email!.hasError('required')) {
      return 'Debe ingresar un email';
    }
    return this.email!.hasError('email') ? 'Ingrese un email válido' : '';
  }
  login() {
    const { email, password } = this.myForm.value;
    this.authService.login(email, password).subscribe((ok) => {
      if (ok === true) {
        this.router.navigateByUrl('/dashboard');
      } else {
        console.log('No puede ingresar');
      }
    });
  }
}
