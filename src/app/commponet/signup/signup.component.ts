import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {  MatCardModule } from '@angular/material/card';
import { AuthenticationService } from '../../services/authentication.service';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, addDoc, collection ,doc ,getDoc} from '@angular/fire/firestore';
import { Router } from '@angular/router';
// import { user } from '@angular/fire/auth';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, RouterOutlet, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCardModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signup = new FormGroup({
    displayName: new FormControl('', Validators.required),
    lname: new FormControl('', Validators.required),
    mnumber: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  constructor(private authService: AuthenticationService ,private router :Router) { }
  async submit() {
    if (this.signup.valid) {
      const { email, password, displayName, lname, mnumber } = this.signup.value;
      try {
        const userCredential = await createUserWithEmailAndPassword(
          this.authService.auth,
          email!,
          password!
        );
  
        const displayNameOrNull = displayName !== undefined ? displayName : null;
  
        await this.authService.updateProfile(displayNameOrNull, null, userCredential.user.uid)
          .subscribe(() => {
            const db = getFirestore();
            addDoc(collection(db, 'users'), {
              uid: userCredential.user.uid,
              displayName: displayNameOrNull,
              lname,
              mnumber,
              email,
              password
            });
  
            this.router.navigate(['/navbar']);
            console.log('User registered successfully!');
          }, (error) => {
            console.error('Error updating profile:', error);
          });
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
  }
}
