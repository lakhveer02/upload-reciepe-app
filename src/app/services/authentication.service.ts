import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { from , Observable} from 'rxjs';
import { updateProfile } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public currentUser$ = authState(this.auth);

  constructor(public auth: Auth) { }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  
  logout(): Observable<void> {
    return from(this.auth.signOut());
  }

  updateProfile(displayName: string | null, photoURL: string | null, uid: string): Observable<void> {
    const user = this.auth.currentUser;
    if (user) {
      return new Observable<void>((observer) => {
        updateProfile(user, { displayName, photoURL })
          .then(() => {
            observer.next();
            observer.complete();
          })
          .catch((error) => {
            observer.error(error);
          });
      });
    } else {
      console.error('User is not logged in.');
      return new Observable<void>((observer) => {
        observer.error('User is not logged in.');
      });
    }
  }
}
