import {Component,OnInit,ViewChild} from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  memberShip: any[] = [
    { value: '300', viewValue: 'HU 300' },
    { value: '500', viewValue: 'HU 500' },
    { value: '1000', viewValue: 'HU 1.000' },
    { value: '10000', viewValue: 'HU 10.000' },
  ];

  @ViewChild('f', { static: true }) ngForm: NgForm;
  
  userData = {
    date: new Date(),
    membership: '300',
  };

  public membership3X = parseFloat(this.userData.membership) * 3.0;
  public recompenseFinal;
  public days;
  public isCheck = false;
  table: any[] = [];

  public dataSource = new MatTableDataSource();
  timeout: any = null;

  // public dataSource
  public displayedColumns: string[] = ['#','day','date','amount','dailyInterest','dailyRewards','rebuy','optionRebuy','balance'];
  totalDays = 600;

  select = 'all';
  filterSelect = '';
  optionRebuy = ""


  private rebuy;
  private amount;
  private dailyRewards;
  private membershipBalance;

  constructor() {
    this.initilizateTable();
    this.dataSource.data = this.table;
    
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnInit() {
    this.returnInvestmentDate();

    this.ngForm.form.valueChanges.subscribe((form) => {
      this.filterSelect = form.select;
      this.dataSource.filter = JSON.stringify(this.filterSelect); 
    });
  }

  public returnInvestmentDate(){
    
    let [returnDate,date,cont] = [0,0,0];

    this.table.forEach(element => {

       returnDate+=element.rebuy
       if(returnDate >=parseInt(this.userData.membership)){
        cont++;
        if(cont==1){
          console.log(element.days);
          date = element.days
        }
       }
    });
  return date
}

public check(event, indice) {
  setTimeout(() => {
    const idCheck = indice - 1;
    this.table[idCheck].isCheck = event.checked;
    if (this.table[idCheck].isCheck) {
      this.invert(idCheck);
    } else {
      this.retire(idCheck);
    }
  }, 250);
}


protected initilizateTable() {

  this.amount = parseFloat(this.userData.membership);
  this.membershipBalance = this.amount * 3 - this.amount * 0.005;
  this.dailyRewards =  this.amount * 0.005;
  this.rebuy =parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;

  for (let i = 1; i <= this.totalDays; i++) {

    if (this.rebuy >= 2000) this.rebuy = 2000;

    this.table.push({
      days: i,
      date: new Date(this.userData.date).setDate(
        new Date(this.userData.date).getDate() + i
      ),
      amount: this.amount,
      dailyInterest: this.amount * 0.005,
      dailyRewards: this.dailyRewards,
      rebuy: this.rebuy,
      membershipBalance: this.membershipBalance,
      isCheck: true,
    });

    if (this.dailyRewards >= 50) {
      this.amount += this.rebuy;
      this.dailyRewards -= this.rebuy;
      this.membershipBalance += this.rebuy * 3 - this.amount * 0.005;
    } else this.membershipBalance += this.rebuy * 3 - this.amount * 0.005;

    this.dailyRewards += this.amount * 0.005;
    this.rebuy = parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;
  }
  this.recompenseFinal = this.table[this.table.length - 1].membershipBalance;
}

  protected updateTable() {

    this.amount = parseFloat(this.userData.membership);
    this.dailyRewards = this.amount * 0.005;
    this.rebuy =parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;
    this.membershipBalance = this.amount * 3 - this.amount * 0.005;

    this.action(-1,this.rebuy,this.amount,this.dailyRewards,this.membershipBalance,true);
  }

  public rebuyNever(){

    this.amount = parseFloat(this.userData.membership);
    this.membershipBalance = this.amount * 3 - this.amount * 0.005;
    this.dailyRewards = this.amount * 0.005;
    this.rebuy=parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;

    this.action(-1,this.rebuy,this.amount,this.dailyRewards,this.membershipBalance,false,1);
  }

  public rebuyAlways(){

    this.amount = parseFloat(this.userData.membership);
    this.membershipBalance = this.amount * 3 - this.amount * 0.005;
    this.dailyRewards = this.amount * 0.005;
    this.rebuy = parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;
    
    this.action(-1,this.rebuy,this.amount,this.dailyRewards,this.membershipBalance,true);
  }

  protected retire(indice) {
    console.log('retirar');

    this.rebuy = this.table[indice].rebuy;
    this.amount = this.table[indice].amount + this.rebuy - this.rebuy;
    this.dailyRewards =this.table[indice].dailyRewards - this.rebuy + this.amount * 0.005;
    this.rebuy =parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;
    this.membershipBalance = this.table[indice].membershipBalance - this.amount * 0.005;

    this.action(indice,this.rebuy,this.amount,this.dailyRewards,this.membershipBalance,true);
  }

  protected invert(indice) {
    console.log('reinvertir');
    this.rebuy = this.table[indice].rebuy;
    this.amount = this.table[indice].amount + this.rebuy;
    this.dailyRewards = this.table[indice].dailyRewards - this.rebuy + this.amount * 0.005;
    this.membershipBalance =this.table[indice].membershipBalance -this.amount * 0.005 + 3 * this.rebuy;
    this.rebuy =  parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;

    this.action(indice,this.rebuy,this.amount,this.dailyRewards,this.membershipBalance,true);
  }

  protected createFilter() {
    let filterFunction = function (data, filter) {
      let searchTerms = JSON.parse(filter);
      if (searchTerms == 'all') {
        return  String(data.isCheck).includes('true') ||  String(data.isCheck).includes('false');
      } else {
        return String(data.isCheck).includes(filter) && data.dailyRewards >= 50;
      }
    };
    return filterFunction;
  }

  public triggerEventKey(event: any) {
    if (this.userData.membership != null)
      this.membership3X = parseFloat(this.userData.membership) * 3.0;
    else 
      this.membership3X = 0;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.select = "all"
      this.updateTable();
    }, 1000);
  }

  dataPicker(event?) {
    this.table.forEach((element, index) => {
      element.date = new Date(this.userData.date).setDate(
        new Date(this.userData.date).getDate() + (index + 1)
      );
    });
  }

  action(indice,rebuy,amount,dailyRewards,membershipBalance,isCheck, never?){

    console.log("ACTION");

    for (let i = indice + 1; i < this.table.length;i++){

          if (rebuy >= 2000) rebuy = 2000;
          this.table[i].amount = amount;
          this.table[i].dailyInterest = amount * 0.005;
          this.table[i].dailyRewards = dailyRewards;
          this.table[i].rebuy = rebuy;
          this.table[i].membershipBalance = membershipBalance;
          this.table[i].isCheck = isCheck;

          if (dailyRewards >= 50){
              if (never !=1){ 
                amount += rebuy;
                membershipBalance += rebuy * 3 - amount * 0.005;
              }
              else{ 
                amount = parseFloat(this.userData.membership)
                membershipBalance +=- this.amount * 0.005;
              };
            dailyRewards -=rebuy;
              
          }else membershipBalance += rebuy * 3 - amount * 0.005;

          dailyRewards += amount * 0.005;
          rebuy =  parseFloat((dailyRewards / 50.0).toString().split('.')[0]) * 50.0;
    }
    this.recompenseFinal = this.table[this.table.length - 1].membershipBalance;
    this.dataSource.data = this.dataSource.data;
    this.returnInvestmentDate();
  }
}
