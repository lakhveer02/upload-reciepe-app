import { Routes } from '@angular/router';
import { LoginComponent } from './commponet/login/login.component';
import { NavbarComponent } from './commponet/nav/nav.component';
import { SignupComponent } from './commponet/signup/signup.component';
export const routes: Routes = [
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'navbar',
        component:NavbarComponent
    },
   
    {
        path:'signup',
        component:SignupComponent
    },
    {
        path:'',redirectTo:'login',pathMatch:'full'
    }
];
