import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';
import { HotToastService } from '@ngneat/hot-toast';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, ReactiveFormsModule, MatFormFieldModule, FormsModule, MatInputModule, RouterOutlet, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  })
  constructor(private router: Router, private authService: AuthenticationService, private toast: HotToastService) { }
  // email =''
  // password =''
  ngOnInit() {

  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password')
  }
  submit() {
    if (!this.loginForm.valid) {
      return
    }
    const { email, password } = this.loginForm.value
    this.authService.login(email!, password!).pipe(
      this.toast.observe({
        success: 'Logged in successfully',
        loading: 'Loggin in ....',
        error: 'There was an Error'
      })
    ).subscribe(() => {
      this.router.navigate(['/navbar'])
    })
  }
}
