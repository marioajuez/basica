import { CdkVirtualForOf } from '@angular/cdk/scrolling';
import { Component } from '@angular/core';

import { FormGroup, FormControl } from '@angular/forms';


export interface Table{
    date,
    amount,
    dailyInterest,
    dailyRewards,
    rebuy,
    membershipBalance,

}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  memberShip: any[] = [
    { value: '300', viewValue: 'HU 300' },
    { value: '500', viewValue: 'HU 500' },
    { value: '1000', viewValue: 'HU 1.000'},
    { value: '10000', viewValue: 'HU 10.000'},
  ];

  
  
  userData = {
    date: new Date(),
    membership: "300"
  };
  
   table: any[] = [];

   timeout: any = null;

  displayedColumns: string[] = [
    'day',
    'date',
    'amount',
    'dailyInterest',
    'dailyRewards',
    'rebuy',
    'optionRebuy',
    'balance',
  ];
  totalDays = 600;
  // rebuy=0
  // dailyRewards= 0  nan
  // amount;

  constructor() {

    this.initilizateTable();
  }

  public triggerEventKey(event: any) {
    clearTimeout(this.timeout);
    this.timeout= setTimeout( () => {
         this.createTable();
    }, 500);
  }

  initilizateTable(){
    let dailyRewards = 0;
    let amount = parseInt(this.userData.membership);

    let rebuy = 0;
    let membershipBalance = (amount*3) - (amount*0.005);

    for (let i = 1; i <= this.totalDays; i++) {

      dailyRewards += amount * 0.005;

      rebuy = (parseFloat(((dailyRewards/50.00).toString()).split(".")[0])*50.00)
      if (rebuy >= 2000) 
            rebuy = 2000;

      this.table.push({
        date: new Date(this.userData.date).setDate(new Date(this.userData.date).getDate() + i),
        amount: amount,
        dailyInterest: amount * 0.005,
        dailyRewards: dailyRewards,
        rebuy: rebuy,
        membershipBalance: membershipBalance,
        isCheck: true
      });

      if (dailyRewards >= 50) {
        amount += rebuy;
        dailyRewards -= rebuy;
        membershipBalance += rebuy * 3 - amount * 0.005;
      } else membershipBalance += rebuy * 3 - amount * 0.005;
    }
  }


  public check(event, indice){

    let indice_ = indice+1

    this.table[indice_].isCheck = event;

    let rebuy = this.table[indice].rebuy;
    let amount= (this.table[indice].amount+ rebuy) - (rebuy);
    let dailyRewards = (this.table[indice].dailyRewards - rebuy)+amount*0.005;
    let membershipBalance = this.table[indice].membershipBalance - amount*0.005 +(3*rebuy)


    for( let i = indice_; i < this.table.length;i++){

      rebuy = parseFloat(((dailyRewards/50.00).toString()).split(".")[0])*50.00


      this.table[i].amount= amount;
      this.table[i].dailyInterest= amount * 0.005;
      this.table[i].dailyRewards= dailyRewards
      this.table[i].rebuy = rebuy
      this.table[i].membershipBalance = membershipBalance


      if(dailyRewards >= 50) {
        dailyRewards -= rebuy;
        amount +=rebuy
        membershipBalance += rebuy * 3 - amount * 0.005;
      } 
      else membershipBalance += rebuy * 3 - amount * 0.005;

      dailyRewards += amount * 0.005;

    }

  }


  select() {
    // this.createTable();
  }
  dataPicker(event?) {
    // this.createTable();
  }

  createTable(){


          let dailyRewards = 0;
          let amount = parseFloat(this.userData.membership);
          if(300>amount) amount=300
          let rebuy = 0;
          let membershipBalance = (amount*3) - (amount*0.005);

          this.table.forEach( (element,index) => {
              dailyRewards += amount * 0.005;

              rebuy = parseFloat(((dailyRewards/50.00).toString()).split(".")[0])*50.00

              element.date= new Date(this.userData.date).setDate(new Date(this.userData.date).getDate() + (index+1))
              element.amount= amount
              element.dailyInterest= amount * 0.005,
              element.dailyRewards= dailyRewards
              element.rebuy= rebuy
              element.membershipBalance= membershipBalance


              if (dailyRewards >= 50) {
                amount+= rebuy;
                dailyRewards -= rebuy;
                membershipBalance += rebuy * 3 - amount * 0.005;
              } 
              else membershipBalance += rebuy * 3 - amount * 0.005;
        })
  

}
}
