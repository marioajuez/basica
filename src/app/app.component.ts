import { Component } from '@angular/core';

import { FormGroup, FormControl } from '@angular/forms';

const ELEMENT_DATA: any[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  memberShip: any[] = [
    { value: '300', viewValue: 'HU 300' },
    { value: '500', viewValue: 'HU 500' },
    { value: '1000', viewValue: 'HU 1000' },
  ];

  userData = {
    date: new Date(),
    membership: this.memberShip[0].value,
  };

  table = [];
  displayedColumns: string[] = [
    'day',
    'date',
    'amount',
    'dailyInterest',
    'dailyRewards',
    'rebuy',
    'balance',
  ];
  totalDays = 600;

  constructor() {
    let dailyRewards = 0;
    let amount = parseInt(this.userData.membership);
    let rebuy = 0;
    let membershipBalance = 900 - 1.5;

    for (let i = 1; i <= this.totalDays; i++) {
      
      dailyRewards += amount * 0.005;

      if (dailyRewards >= 50) rebuy = 50;
      else rebuy = 0;

      this.table.push({
        date: new Date().setDate(new Date().getDate() + i),
        amount: amount,
        dailyInterest: amount * 0.005,
        dailyRewards: dailyRewards,
        rebuy: rebuy,
        membershipBalance: membershipBalance,
      });

      if (dailyRewards >= 50) {
        amount += 50;
        dailyRewards -= 50;
        membershipBalance += rebuy * 3 - amount * 0.005;
      } else membershipBalance += rebuy * 3 - amount * 0.005;
    }
  }

  addEvent() {
    this.table = [];
    for (let i = 1; i <= this.totalDays; i++) {
      this.table.push({
        date: new Date(this.userData.date).setDate(
          new Date(this.userData.date).getDate() + i
        ),
        dailyRewards: 0,
      });
    }
  }
  select() {}
}
