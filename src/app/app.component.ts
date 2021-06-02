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


  private rebuy
  private amount
  private dailyRewards
  private membershipBalance
  
  
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


  constructor() {
      this.withRebuyAll();
  }

  public triggerEventKey(event: any) {
    clearTimeout(this.timeout);
    this.timeout= setTimeout( () => {
         this.updateTable();
    }, 500);
  }

  initilizateTable(){

    // this.withoutRebuyAll();
  }

  public withoutRebuyAll(){

    let dailyRewards = 0;
    let amount = parseFloat(this.userData.membership);

    let rebuy = 0;
    let membershipBalance = (amount*3) - (amount*0.005);

    for (let i = 1; i <= this.totalDays; i++) {

      dailyRewards+= amount * 0.005;

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
      });

      if (dailyRewards >= 50) {
          amount = parseFloat(this.userData.membership);
          dailyRewards -= rebuy;
          membershipBalance += rebuy * 3 - amount * 0.005;
      } 
      else membershipBalance += rebuy * 3 - amount * 0.005;
    }
  }

  public withRebuyAll(){
    let dailyRewards = 0;
    let amount = parseFloat(this.userData.membership);

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

    this.table[indice].isCheck = event 
    if(this.table[indice].isCheck){
        this.invert(indice);
    }else{
        this.retire(indice);
    }
  }


  public retire(indice){

    this.rebuy =this.table[indice].rebuy;
    this.amount= (this.table[indice].amount + this.rebuy) - (this.rebuy);
    this.dailyRewards = (this.table[indice].dailyRewards - this.rebuy) + this.amount*0.005;
    this.membershipBalance = this.table[indice].membershipBalance - this.amount*0.005 +(3* this.rebuy)
      
      for( let i = indice+1; i < this.table.length;i++){

        this.rebuy = parseFloat(((this.dailyRewards/50.00).toString()).split(".")[0])*50.00

        this.table[i].amount= this.amount;
        this.table[i].dailyInterest= this.amount * 0.005;
        this.table[i].dailyRewards= this.dailyRewards
        this.table[i].rebuy = this.rebuy
        this.table[i].membershipBalance = this.membershipBalance

        if(this.dailyRewards >= 50) {
          this.dailyRewards -= this.rebuy;
          this.amount +=this.rebuy
          this.membershipBalance += this.rebuy * 3 - this.amount * 0.005;
        } 
        else this.membershipBalance += this.rebuy * 3 - this.amount * 0.005;
        this.dailyRewards += this.amount * 0.005;
      }
      console.log((this.table[this.table.length-1].membershipBalance));
  }

  invert(indice){
    
    console.log("reinvertir")
    this.rebuy = this.table[indice].rebuy;
    this.amount= this.table[indice].amount + this.rebuy;
    this.dailyRewards = (this.table[indice].dailyRewards - this.rebuy )+ this.amount*0.005;
    this.membershipBalance = this.table[indice].membershipBalance - this.amount*0.005 +(3*this.rebuy)

    for( let i = indice+1 ; i < this.table.length;i++){
        
        this.rebuy = parseFloat(((this.dailyRewards/50.00).toString()).split(".")[0])*50.00
        this.table[i].amount= this.amount;
        this.table[i].dailyInterest= this.amount * 0.005;
        this.table[i].dailyRewards= this.dailyRewards
        this.table[i].rebuy = this.rebuy
        this.table[i].membershipBalance = this.membershipBalance

        if(this.dailyRewards >= 50) {
          this.amount+=this.rebuy;
          this.dailyRewards -= this.rebuy;
          this.membershipBalance += this.rebuy * 3 - this.amount * 0.005;
        } 
        else this.membershipBalance += this.rebuy * 3 - this.amount * 0.005;

        this.dailyRewards+= this.amount * 0.005;
    }
    console.log(( this.table[this.table.length-1].membershipBalance));
  }


  updateTable(){

    this.rebuy = 0
    this.amount= parseFloat(this.userData.membership);
    this.dailyRewards = 0
    this.membershipBalance = (this.amount*3) - (this.amount*0.005);

    this.table.forEach( (element, index) => {
      this.dailyRewards += this.amount * 0.005;

      this.rebuy = (parseFloat(((this.dailyRewards/50.00).toString()).split(".")[0])*50.00)
      if (this.rebuy >= 2000) 
            this.rebuy = 2000;

        element.date= new Date(this.userData.date).setDate(new Date(this.userData.date).getDate() +(index+1)),
        element.amount= this.amount,
        element.dailyInterest= this.amount * 0.005,
        element.dailyRewards= this.dailyRewards,
        element.rebuy= this.rebuy,
        element.membershipBalance= this.membershipBalance,
        element.isCheck= true

      if (this.dailyRewards >= 50) {
        this.amount += this.rebuy;
        this.dailyRewards -= this.rebuy;
        this.membershipBalance += this.rebuy * 3 - this.amount * 0.005;
      } else this. membershipBalance += this.rebuy * 3 - this.amount * 0.005;
    })
  }
  dataPicker(event?) {

  }

  createTable(){
  }
}
