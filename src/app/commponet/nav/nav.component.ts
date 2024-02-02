import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet  } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { RecipeShearingComponent } from '../recipe-shearing/recipe-shearing.component';
import { User } from 'firebase/auth';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterOutlet,
    MatIconModule,
    RouterLink,
    NgIf,
    RecipeShearingComponent
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavbarComponent implements OnInit {
  showShoppingCart: boolean = false;
  hideNavbar: boolean = false;
  isLoggedIn: boolean = true;
  user : User|null =null ;
showUserProfileModal:boolean=false;
  constructor(private router: Router,public authService:AuthenticationService) {
    
  }
  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      // console.log('User:', user);
      this.user = user;
    });
  }

  openShoppingCart() {
    this.showShoppingCart = !this.showShoppingCart;
    this.showUserProfileModal = false;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['login']);
    });
  }

  showUserProfile() {
    this.showUserProfileModal = !this.showUserProfileModal;
  }

  closeUserProfile() {
    this.showUserProfileModal = false;
  }

}

