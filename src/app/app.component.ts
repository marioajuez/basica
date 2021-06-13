import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';


export interface Table {
  date;
  amount;
  dailyInterest;
  dailyRewards;
  rebuy;
  membershipBalance;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(MatTable) matTable: MatTable<any>;


  showTable= false

  panelOpenState = false;
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

  private rebuy;
  private amount;
  private dailyRewards;
  private membershipBalance;
  public membership3X = parseFloat(this.userData.membership) * 3.0;
  public recompenseFinal;
  public days;
  public isCheck = false;
  table: any[] = [];

  public dataSource = new MatTableDataSource();
  // public dataSource

  timeout: any = null;

  public displayedColumns: string[] = [
    '#',
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

  select = 'all';
  filterSelect = '';
  
  optionRebuy = ""

  constructor() {
    this.initilizateTable();
    // this.withoutRebuyAll();
    
    this.dataSource.data = this.table;

    console.log(this.table.length)
    this.dataSource.filterPredicate = this.createFilter();
  }


  public withoutRebuyAll() {
    let dailyRewards = 0;
    let amount = parseFloat(this.userData.membership);

    let rebuy = 0;
    let membershipBalance = amount * 3 - amount * 0.005;

    for (let i = 1; i <= this.totalDays; i++) {
      dailyRewards += amount * 0.005;

      rebuy = parseFloat((dailyRewards / 50.0).toString().split('.')[0]) * 50.0;
      if (rebuy >= 2000) rebuy = 2000;

      this.table.push({
        days: i,
        date: new Date(this.userData.date).setDate(
          new Date(this.userData.date).getDate() + i
        ),
        amount: amount,
        dailyInterest: amount * 0.005,
        dailyRewards: dailyRewards,
        rebuy: rebuy,
        membershipBalance: membershipBalance,
        isCheck: false
      });

      if (dailyRewards >= 50) {

        amount = parseFloat(this.userData.membership);
        dailyRewards -= rebuy;
        membershipBalance += - amount * 0.005;

      }else 
      {   
        membershipBalance += rebuy * 3 - amount * 0.005
      };
    }
    this.recompenseFinal = this.table[this.table.length - 1].membershipBalance;
  }

    public initilizateTable() {
    let dailyRewards = 0;
    let amount = parseFloat(this.userData.membership);

    let rebuy = 0;
    let membershipBalance = amount * 3 - amount * 0.005;
    let isCheck = false;

    for (let i = 1; i <= this.totalDays; i++) {
      dailyRewards += amount * 0.005;

      rebuy = parseFloat((dailyRewards / 50.0).toString().split('.')[0]) * 50.0;
      if (rebuy >= 2000) rebuy = 2000;
      if (dailyRewards >= 50) {
        isCheck = true;
      }

      this.table.push({
        days: i,
        date: new Date(this.userData.date).setDate(
          new Date(this.userData.date).getDate() + i
        ),
        amount: amount,
        dailyInterest: amount * 0.005,
        dailyRewards: dailyRewards,
        rebuy: rebuy,
        membershipBalance: membershipBalance,
        isCheck: isCheck,
      });

      if (dailyRewards >= 50) {
        isCheck = false;
        amount += rebuy;
        dailyRewards -= rebuy;
        membershipBalance += rebuy * 3 - amount * 0.005;
      } else membershipBalance += rebuy * 3 - amount * 0.005;
    }
    this.recompenseFinal = this.table[this.table.length - 1].membershipBalance;
  }



  rebuyNever(){
    this.membershipBalance = 0
    this.dailyRewards = 0;
    this.amount = parseFloat(this.userData.membership);
    this.rebuy = 0;
    this.membershipBalance = this.amount * 3 - this.amount * 0.005;
    
    this.table.forEach ( (element,index) =>{
      this.dailyRewards += this.amount * 0.005;
      this.rebuy = parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;
      if (this.rebuy >= 2000) this.rebuy = 2000;

      element.isCheck= false
      element.date = new Date(this.userData.date).setDate(new Date(this.userData.date).getDate() + (index + 1)),
      element.amount = this.amount,
      element.dailyInterest = this.amount * 0.005,
      element.dailyRewards = this.dailyRewards,
      element.rebuy = this.rebuy
      element.membershipBalance = this.membershipBalance

      if (this.dailyRewards >= 50) {
        this.amount = parseFloat(this.userData.membership);
        this.dailyRewards -= this.rebuy;
        this.membershipBalance += - this.amount * 0.005;
      } else  this.membershipBalance += this.rebuy * 3 - this.amount * 0.005;
    });

    this.recompenseFinal = this.table[this.table.length - 1].membershipBalance;

    this.dataSource.data = this.dataSource.data;
  }


  rebuyAlways(){
    this.membershipBalance = 0
    this.dailyRewards = 0;
    this.amount = parseFloat(this.userData.membership);
    this.rebuy = 0;
    this.membershipBalance = this.amount * 3 - this.amount * 0.005;
    let isCheck = false;
    
    
    this.table.forEach ( (element,index) =>{
      this.dailyRewards += this.amount * 0.005;
      this.rebuy = parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;
      if (this.rebuy >= 2000) this.rebuy = 2000;
      if (this.dailyRewards >= 50)  isCheck = true;
      
      element.isCheck= isCheck
      element.date = new Date(this.userData.date).setDate(new Date(this.userData.date).getDate() + (index + 1)),
      element.amount = this.amount,
      element.dailyInterest = this.amount * 0.005,
      element.dailyRewards = this.dailyRewards,
      element.rebuy = this.rebuy
      element.membershipBalance = this.membershipBalance

      if (this.dailyRewards >= 50) {
        isCheck = false;
        this.amount += this.rebuy;
        this.dailyRewards -= this.rebuy;
        this.membershipBalance += this.rebuy * 3 - this.amount * 0.005;
      } else  this.membershipBalance += this.rebuy * 3 - this.amount * 0.005;
    });
    this.recompenseFinal = this.table[this.table.length - 1].membershipBalance;
    this.dataSource.data = this.dataSource.data;
  }

  ngOnInit() {
    this.ngForm.form.valueChanges.subscribe((form) => {
      this.filterSelect = form.select;
      this.dataSource.filter = JSON.stringify(this.filterSelect);
    });
  }

  createFilter() {
    let filterFunction = function (data, filter) {

      let searchTerms = JSON.parse(filter);
      if (searchTerms == 'all') {
        return (
          String(data.isCheck).includes('true') ||
          String(data.isCheck).includes('false')
        );
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

  public check(event, indice) {
    setTimeout(() => {
      const idCheck = indice - 1;
      this.table[idCheck].isCheck = event.checked;

      if (this.table[idCheck].isCheck) {
        this.invert(idCheck);
        this.dataSource.data = this.dataSource.data;
      } else {
        this.retire(idCheck);
        this.dataSource.data = this.dataSource.data;
      }
    }, 250);
  }





  public retire(indice) {
    console.log('retirar');

    this.rebuy = this.table[indice].rebuy;
    this.amount = this.table[indice].amount + this.rebuy - this.rebuy;
    this.dailyRewards =this.table[indice].dailyRewards - this.rebuy + this.amount * 0.005;
    this.membershipBalance = this.table[indice].membershipBalance - this.amount * 0.005;

    for (let i = indice + 1; i < this.table.length; i++) {
      this.rebuy = parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;

      if (this.dailyRewards >= 50) {
        this.isCheck = true;
      }

      this.table[i].isCheck = this.isCheck;
      this.table[i].days = i + 1;
      this.table[i].amount = this.amount;
      this.table[i].dailyInterest = this.amount * 0.005;
      this.table[i].dailyRewards = this.dailyRewards;
      this.table[i].rebuy = this.rebuy;
      this.table[i].membershipBalance = this.membershipBalance;


      if(this.dailyRewards >= 50 && !this.table[i].isCheck){
        this.membershipBalance += - this.amount * 0.005;
      }

      if (this.dailyRewards >= 50 && this.table[i].isCheck) {
        this.isCheck = false;
        this.dailyRewards -= this.rebuy;
        this.amount += this.rebuy;
        this.membershipBalance += this.rebuy * 3 - this.amount * 0.005;

      } 
      else this.membershipBalance += this.rebuy * 3 - this.amount * 0.005;

      this.dailyRewards += this.amount * 0.005;
    }
    this.recompenseFinal = this.table[this.table.length - 1].membershipBalance;

    // console.log(this.table[this.table.length - 1].membershipBalance);
  }

  invert(indice) {
    console.log('reinvertir');
    this.rebuy = this.table[indice].rebuy;
    this.amount = this.table[indice].amount + this.rebuy;
    this.dailyRewards =
      this.table[indice].dailyRewards - this.rebuy + this.amount * 0.005;
    this.membershipBalance =
      this.table[indice].membershipBalance -
      this.amount * 0.005 +
      3 * this.rebuy;

    for (let i = indice + 1; i < this.table.length; i++) {
      this.rebuy =
        parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;

      if (this.dailyRewards >= 50) {
        this.isCheck = true;
      }

      this.table[i].isCheck = this.isCheck;
      this.table[i].days = i + 1;

      this.table[i].amount = this.amount;
      this.table[i].dailyInterest = this.amount * 0.005;
      this.table[i].dailyRewards = this.dailyRewards;
      this.table[i].rebuy = this.rebuy;
      this.table[i].membershipBalance = this.membershipBalance;

      if (this.dailyRewards >= 50) {
        this.isCheck = false;
        this.amount += this.rebuy;
        this.dailyRewards -= this.rebuy;
        this.membershipBalance += this.rebuy * 3 - this.amount * 0.005;
      } else this.membershipBalance += this.rebuy * 3 - this.amount * 0.005;

      this.dailyRewards += this.amount * 0.005;
    }
    this.recompenseFinal = this.table[this.table.length - 1].membershipBalance;

    console.log(this.table[this.table.length - 1].membershipBalance);
  }

  updateTable() {

    this.rebuy = 0;
    this.amount = parseFloat(this.userData.membership);
    this.dailyRewards = 0;
    this.membershipBalance = this.amount * 3 - this.amount * 0.005;

    this.table.forEach((element, index) => {
      this.dailyRewards += this.amount * 0.005;

      this.rebuy =
        parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;
      if (this.rebuy >= 2000) this.rebuy = 2000;

      (element.date = new Date(this.userData.date).setDate(
        new Date(this.userData.date).getDate() + (index + 1)
      )),
        (element.amount = this.amount),
        (element.dailyInterest = this.amount * 0.005),
        (element.dailyRewards = this.dailyRewards),
        (element.rebuy = this.rebuy),
        (element.membershipBalance = this.membershipBalance),
        (element.isCheck = true);

      if (this.dailyRewards >= 50) {
        this.amount += this.rebuy;
        this.dailyRewards -= this.rebuy;
        this.membershipBalance += this.rebuy * 3 - this.amount * 0.005;
      } else this.membershipBalance += this.rebuy * 3 - this.amount * 0.005;

      this.dataSource.data = this.dataSource.data;
    });

    this.recompenseFinal = this.table[this.table.length - 1].membershipBalance;
  }





  dataPicker(event?) {
    this.table.forEach((element, index) => {
      element.date = new Date(this.userData.date).setDate(
        new Date(this.userData.date).getDate() + (index + 1)
      );
    });
  }

  createTable() {}
}
