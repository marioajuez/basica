import { CdkVirtualForOf } from '@angular/cdk/scrolling';import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import { FormGroup, FormControl } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { filter } from 'rxjs/operators';


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

  @ViewChild(MatTable) matTable: MatTable<any>;

  panelOpenState = false;
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

  private rebuy
  private amount
  private dailyRewards
  private membershipBalance
  public membership3X = parseFloat(this.userData.membership)*3.00;
  public recompenseFinal;
  public days;
  table: any[] = [];
  tableFooterColumns: string[] = ['total'];

  
 
  public dataSource = new MatTableDataSource()
  // public dataSource

  timeout: any = null;

  

  public displayedColumns: string[] = [
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
 

  public departureStation = '';
  public select = ''

  constructor() {
      this.withRebuyAll();
      this.dataSource.data = this.table
      // this.dataSource = new MatTableDataSource(this.table)
      this.dataSource.filterPredicate = this.getFilterPredicate();
      // this.matTable.renderRows();
    }


  applyFilter() {
    console.log(this.select);
    const filterValue = this.select
    this.dataSource.filter = filterValue.trim().toLowerCase();
}

getFilterPredicate(){

  return (row, filter) => {

    if ('0'.includes(filter.toLowerCase())) {
          return !row.rebuy;
    }
    if ('50'.includes(filter.toLowerCase())) {
          return row.rebuy;
    }
    if ('1'.includes(filter.toLowerCase())) {
      return true
    }
  }
}

    // row.rebuy == filters

    // JSON.stringify(row.rebuy).indexOf(filters.trim().toLocaleLowerCase()) !=-1;
    // console.log(row.rebuy, filters)

    // row.rebuy.indexOf(filters) !== -1;

    // row.rebuy == filters;
 
    // const matchFilter = [];
    // console.log();

    // console.log(row, filters);

applyFilters(event) {
  const filterValue = event.target.value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

}
  

  public triggerEventKey(event: any) {
    if(this.userData.membership!= null) this.membership3X = parseFloat(this.userData.membership)*3.00;
    else this.membership3X= 0

    clearTimeout(this.timeout);
    this.timeout= setTimeout( () => {
         this.updateTable();
    }, 1000);
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
    this.recompenseFinal= this.table[this.table.length -1].membershipBalance
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
        days: i,
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
    this.recompenseFinal= this.table[this.table.length -1].membershipBalance
  }


  public check(event){

    const idCheck = parseFloat(event.source.id.replace(/\D/g, ''))-1;

    this.table[idCheck].isCheck = event.checked

    console.log(event.checked,idCheck );

    if(this.table[idCheck].isCheck){
      
      this.invert(idCheck);
    }else{
      // const filterValue = '50'
      // this.dataSource.filter = filterValue.trim().toLowerCase();

      this.retire(idCheck);
 
    }
  }


  public retire(indice){

    // console.log(this.dataSource.data)

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
      this.recompenseFinal= this.table[this.table.length -1].membershipBalance

      const filterValue = '50';
      this.dataSource.filter = filterValue.trim().toLowerCase();
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

         
        // this.table[i].days = this.days++;
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
    this.recompenseFinal= this.table[this.table.length -1].membershipBalance

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

        element.date= new Date(this.userData.date).setDate(new Date(this.userData.date).getDate()+(index+1)),
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

    this.recompenseFinal= this.table[this.table.length -1].membershipBalance
  }
  dataPicker(event?) {
    this.table.forEach( (element, index) =>{
      element.date= new Date(this.userData.date).setDate(new Date(this.userData.date).getDate()+(index+1))
    })
  }

  createTable(){
  }
}
