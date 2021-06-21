import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router
  ) {}

  login(user: User) {
    // console.log(user.userName == 'mariojuez' && user.password == '1' );
    if (user.userName == 'mariojuez' && user.password == '1' ) {
      this.loggedIn.next(true);
      this.router.navigate(['home']);
    }
  }

  // logout() {
  //   this.loggedIn.next(false);
  //   this.router.navigate(['/login']);
  // }
}