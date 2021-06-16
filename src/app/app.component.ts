import {Component,OnInit,ViewChild} from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';

interface dataTable{
  days?:number,
  date?:any,
  amount:number,
  dailyInterest?:number,
  dailyRewards:number,
  membershipBalance:number,
  rebuy:number,
  isCheck?:boolean,
  index?:number
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
    { value: '1000', viewValue: 'HU 1.000' },
    { value: '10000', viewValue: 'HU 10.000' },
  ];

  @ViewChild('f', { static: true }) ngForm: NgForm;
  userData = {
    date: new Date(),
    membership: '300',
  };

// ----- variables to display in view (template)---
  public membership3X = parseFloat(this.userData.membership) * 3.0;
  public recompenseFinal;
// ------

  table: dataTable[]= [];
  public dataSource = new MatTableDataSource();
  public displayedColumns: string[] = ['#','day','date','amount','dailyInterest','dailyRewards','rebuy','optionRebuy','balance'];
  totalDays = 600;

  select = 'all';
  filterSelect = '';
  optionRebuy = ""

  timeout: any = null;

// --------- variables to perform calculations ------------
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

  calculate(data:dataTable, { rebuyNever= false, initalizeTable = false}= {}){

    for (let i = data.index + 1; i < this.table.length;i++){

      if (data.rebuy >= 2000) data.rebuy = 2000;

        this.table[i].amount = data.amount;
        this.table[i].dailyInterest = data.amount * 0.005;
        this.table[i].dailyRewards = data.dailyRewards;
        this.table[i].rebuy = data.rebuy;
        this.table[i].membershipBalance = data.membershipBalance;
        this.table[i].isCheck = data.isCheck;

      if (data.dailyRewards >= 50){
          if (!rebuyNever){ 
            data.amount += data.rebuy;
            data.membershipBalance += data.rebuy * 3 - data.amount * 0.005;
          }
          else{ 
            data.amount = parseFloat(this.userData.membership)
            data.membershipBalance +=- data.amount * 0.005;
          };
        data.dailyRewards -=  data.rebuy;
          
      }else data.membershipBalance += data.rebuy * 3 - data.amount * 0.005;

      data.dailyRewards += data.amount * 0.005;
      data.rebuy =  parseFloat((data.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;
    }

    this.recompenseFinal = this.table[this.table.length - 1].membershipBalance;
    console.log(this.recompenseFinal);
    this.dataSource.data = this.dataSource.data;
    this.returnInvestmentDate();
}

  public returnInvestmentDate(){

    let [returnDate,date,cont] = [0,0,0];

      this.table.forEach(element => {
        returnDate+=element.rebuy
        if(returnDate >=parseInt(this.userData.membership)){
          cont++;
          if(cont==1){
            // console.log(element.days);
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

  protected updateTable(){

    this.amount = parseFloat(this.userData.membership);
    this.dailyRewards = this.amount * 0.005;
    this.rebuy =parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;
    this.membershipBalance = this.amount * 3 - this.amount * 0.005;

    this.calculate(
      {
        amount: this.amount ,
        dailyRewards: this.dailyRewards,
        membershipBalance: this.membershipBalance,
        rebuy:this.rebuy,
        isCheck:true,
        index:-1
      }
    )
  }

  public rebuyNever(){

    this.amount = parseFloat(this.userData.membership);
    this.membershipBalance = this.amount * 3 - this.amount * 0.005;
    this.dailyRewards = this.amount * 0.005;
    this.rebuy=parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;

    this.calculate({
          amount: this.amount ,
          dailyRewards: this.dailyRewards,
          membershipBalance: this.membershipBalance,
          rebuy:this.rebuy,
          isCheck:false,
          index:-1
        },{ 
        rebuyNever: true 
    })
  }

  public rebuyAlways(){

    this.amount = parseFloat(this.userData.membership);
    this.membershipBalance = this.amount * 3 - this.amount * 0.005;
    this.dailyRewards = this.amount * 0.005;
    this.rebuy = parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;

    this.calculate({
        amount: this.amount ,
        dailyRewards: this.dailyRewards,
        membershipBalance: this.membershipBalance,
        rebuy:this.rebuy,
        isCheck:true,
        index:-1
      })
  }

  protected retire(indice) {
    console.log('retirar');

    this.rebuy = this.table[indice].rebuy;
    this.amount = this.table[indice].amount + this.rebuy - this.rebuy;
    this.dailyRewards =this.table[indice].dailyRewards - this.rebuy + this.amount * 0.005;
    this.rebuy =parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;
    this.membershipBalance = this.table[indice].membershipBalance - this.amount * 0.005;

    this.calculate({
        amount: this.amount ,
        dailyRewards: this.dailyRewards,
        membershipBalance: this.membershipBalance,
        rebuy:this.rebuy,
        isCheck:true,
        index:indice
      })
  }

  protected invert(indice) {
    console.log('reinvertir');
    this.rebuy = this.table[indice].rebuy;
    this.amount = this.table[indice].amount + this.rebuy;
    this.dailyRewards = this.table[indice].dailyRewards - this.rebuy + this.amount * 0.005;
    this.membershipBalance =this.table[indice].membershipBalance -this.amount * 0.005 + 3 * this.rebuy;
    this.rebuy =  parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;

    this.calculate({
        amount: this.amount ,
        dailyRewards: this.dailyRewards,
        membershipBalance: this.membershipBalance,
        rebuy:this.rebuy,
        isCheck:true,
        index:indice
      })
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
}
