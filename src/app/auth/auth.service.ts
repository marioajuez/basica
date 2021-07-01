import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  

   private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private router: Router
  ) {}

 

  get isLoggedIn() {
    console.log("djkasdjl");
    return this.loggedIn.asObservable();
  }



  login(user: User) {
    if (user.userName == 'mariojuez' && user.password == 'Mario.21' ) {
      // console.log("hola");
      this.loggedIn.next(true);
      // console.log("chao");
      this.router.navigate(['home']);
    }
  }

  // logout() {
  //   this.loggedIn.next(false);
  //   this.router.navigate(['/login']);
  // }
}