
import {ChangeDetectorRef, Component,ElementRef,EventEmitter,OnInit,Output,ViewChild,AfterViewInit} from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface dataTable{
  days?:number,
  date?:any,
  amount:number,
  dailyInterest?:number,
  dailyRewards?:number,
  membershipBalance?:number,
  rebuy?:number,
  index?:number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('f', { static: true }) ngForm: NgForm;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('table', {read: ElementRef}) paginatorTable: ElementRef;
  @ViewChild('table') table_: MatTable<any>;
  
  userData = {
    date: new Date(),
    membership: '300',
  };


// ----- variables to display in view (template)  ---
  public membership3X = parseFloat(this.userData.membership) * 3.0;
  public recompenseFinal: number;
  public dateReturnInvest = {date: null,day: null};
// ------------------------

  table: dataTable[]= [];
  // public dataSource = new MatTableDataSource();
  public dataSource:MatTableDataSource<any>;
  public displayedColumns: string[] = ['day','date','amount','dailyInterest','dailyRewards','rebuy','balance'];
  totalDays = 600;

  timeout: any = null;

// --------- variables to store calculations ------------
  private rebuy;
  private amount;
  private dailyRewards;
  private membershipBalance



// --------------------------------------------
  constructor() {
    this.initilizateTable();
    this.dataSource = new MatTableDataSource(this.table);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  ngOnInit() {

  }

  protected initilizateTable() {

    this.amount = parseFloat(this.userData.membership);
    this.membershipBalance = this.amount * 3 - this.amount * 0.005;
    this.dailyRewards =  this.amount * 0.005;
    this.rebuy =parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;

    this.calculate({
        amount: this.amount,
        dailyRewards: this.dailyRewards,
        membershipBalance: this.membershipBalance,
        rebuy:this.rebuy,
        index:-1
      },{initializateTable: true, rebuyNever:true})
  }

  private createOrUpdateTable(data:dataTable, initializateTable = false){

    if(initializateTable){
      this.table.push({
        days: data.days+1,
        date:new Date(this.userData.date).setDate(
          new Date(this.userData.date).getDate() + data.days),
        amount: data.amount,
        dailyInterest: data.dailyInterest ,
        dailyRewards: data.dailyRewards,
        rebuy: data.rebuy,
        membershipBalance: data.membershipBalance,
      });
    }else{
      this.table[data.days].amount = data.amount;
      this.table[data.days].dailyInterest = data.dailyInterest;
      this.table[data.days].dailyRewards = data.dailyRewards;
      this.table[data.days].rebuy = data.rebuy;
      this.table[data.days].membershipBalance = data.membershipBalance;
    }
  }

  private calculate(data:dataTable, { rebuyNever= false, rebuyAlways = false, initializateTable = false}= {}){

    //se inicializa el ciclo segun el indice que llegue
    for (let i = data.index+1; i < this.totalDays;i++){

      // se crea por primera la tabla de datos o se actualiza
      this.createOrUpdateTable({
        days: i,
        amount: data.amount,
        dailyInterest: data.amount * 0.005,
        dailyRewards: data.dailyRewards,
        rebuy: data.rebuy,
        membershipBalance: data.membershipBalance,
    }, initializateTable); 

      if (data.dailyRewards >= 50){

              //esta formula es para que se reinvierta siempre o algunas veces.
              data.amount += data.rebuy;
              data.membershipBalance += data.rebuy * 3 - data.amount * 0.005;
              data.dailyRewards -= data.rebuy;
      }
      else data.membershipBalance += data.rebuy * 3 - data.amount * 0.005; // Recompensas en Saldo en ejecución

      data.dailyRewards += data.amount * 0.005; // Saldo Diario de las recompensas
      data.rebuy =  parseFloat((data.dailyRewards / 50.0).toString().split('.')[0]) * 50.0; // se obtiene el valor de la recompra
    }
    this.recompenseFinal = this.table[this.table.length - 1].membershipBalance;
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
        index:-1
      },{
        rebuyAlways: true
      }
    )
  }


  public triggerEventKey(event: any) {
    if (this.userData.membership != null)
      this.membership3X = parseFloat(this.userData.membership) * 3.0;
    else 
      this.membership3X = 0;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.updateTable();
    }, 1000);
  }

  public dataPicker(event?) {
    this.table.forEach((element, index) => {
      element.date = new Date(this.userData.date).setDate(
        new Date(this.userData.date).getDate() + (index + 1)
      );
    });
  }

  public paginationChange(paginationDetails) {
    this.paginatorTable.nativeElement.scrollIntoView({behavior:"smooth"});
  }

}
