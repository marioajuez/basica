
import {Component,ElementRef,OnInit,ViewChild} from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

interface dataTable{
  days?:number,
  date?:any,
  amount:number,
  dailyInterest?:number,
  dailyRewards?:number,
  membershipBalance?:number,
  rebuy?:number,
  isCheck?:boolean,
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

  userData = {
    date: new Date(),
    membership: '300',
  };

  listFilter = [
    { name:'-- no filters --', value: "all"},
    { name:'yes', value: 'true'},
    { name:'no',value: 'false'}
  ]
  select = this.listFilter[0].value ;
 
  public optionRebuy = "default"


// ----- variables to display in view (template)  ---
  public membership3X = parseFloat(this.userData.membership) * 3.0;
  public recompenseFinal: number;
  public dateReturnInvest = {date: null,day: null};
// ------------------------

  table: dataTable[]= [];
  public dataSource = new MatTableDataSource();
  public displayedColumns: string[] = ['#','day','date','amount','dailyInterest','dailyRewards','rebuy','optionRebuy','balance'];
  totalDays = 600;

  filterSelect = '';
  timeout: any = null;

// --------- variables to store calculations ------------
  private rebuy;
  private amount;
  private dailyRewards;
  private membershipBalance
// --------------------------

  constructor(){
    this.initilizateTable();
    this.dataSource.data = this.table;
    this.dataSource.filterPredicate = this.createFilter();


  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }


  ngOnInit() {
    this.returnInvestmentDate();
    this.ngForm.form.valueChanges.subscribe((form) => {
      
      this.filterSelect = form.select;
      this.dataSource.filter = (this.filterSelect); 
      console.log(this.dataSource.filteredData.length != this.dataSource.data.length);

    });
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
        isCheck:true,
        index:-1
      },{initalizeTable: true})
  }

  paginationChange(paginationDetails) {
    this.paginatorTable.nativeElement.scrollIntoView({behavior:"smooth"});
  }

  private calculate(data:dataTable, { rebuyNever= false, initalizeTable = false}= {}){

    for (let i = data.index + 1; i < this.totalDays;i++){

      if (data.rebuy >= 2000) data.rebuy = 2000;

      this.createOrUpdateTable({
          days: i,
          amount: data.amount,
          dailyInterest: data.amount * 0.005,
          dailyRewards: data.dailyRewards,
          rebuy: data.rebuy,
          membershipBalance: data.membershipBalance,
          isCheck: data.isCheck,
      }, initalizeTable); 

      if (data.dailyRewards >= 50){
          if (!rebuyNever){ 
            data.amount += data.rebuy;
            data.membershipBalance += data.rebuy * 3 - data.amount * 0.005;
          }
          else{ 
            data.amount = parseFloat(this.userData.membership)
            data.membershipBalance +=- data.amount * 0.005;
          };
          data.dailyRewards -= data.rebuy;
      }else data.membershipBalance += data.rebuy * 3 - data.amount * 0.005;
      data.dailyRewards += data.amount * 0.005;
      data.rebuy =  parseFloat((data.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;
    }
    this.recompenseFinal = this.table[this.table.length - 1].membershipBalance;
    console.log(this.recompenseFinal);
    this.dataSource.data = this.dataSource.data;
    this.returnInvestmentDate();
  }



  private createOrUpdateTable(data:dataTable, initializateTable:boolean = false){

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
        isCheck: data.isCheck,
      });
    }else{
      this.table[data.days].amount = data.amount;
      this.table[data.days].dailyInterest = data.dailyInterest;
      this.table[data.days].dailyRewards = data.dailyRewards;
      this.table[data.days].rebuy = data.rebuy;
      this.table[data.days].membershipBalance = data.membershipBalance;
      this.table[data.days].isCheck = data.isCheck;
    }
  }

  public returnInvestmentDate(){
    let [sumRebuy,cont] = [0,0];

    this.table.forEach( (element) => {
        sumRebuy+=element.rebuy
        if(sumRebuy >=parseInt(this.userData.membership)){
          cont++;
          if(cont==1){
            this.dateReturnInvest.date = element.date
            this.dateReturnInvest.day = element.days
          }
        }
      });

  }

  public check(event, indice) {
  setTimeout(() => {
    this.optionRebuy = "default";
    const idCheck = indice - 1;

    // console.log(this.dataSource);
    // console.log(this.dataSource.filteredData[idCheck])
    this.table[idCheck].isCheck = event.checked;

    if (this.table[idCheck].isCheck)this.invert(idCheck)
    else this.retire(idCheck);
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
    this.dataSource.filter = JSON.stringify(false); 
    this.select = "false"
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

      this.dataSource.filter = JSON.stringify(true); 
      this.select = "true"
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
      if (filter == 'all') {
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
    this.returnInvestmentDate();

  }

}
