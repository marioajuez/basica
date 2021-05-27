import { Component } from '@angular/core';

import {FormGroup, FormControl} from '@angular/forms';


const ELEMENT_DATA: any[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  memberShip: any[] = [
    {value: '300', viewValue: 'HU 300'},
    {value: '500', viewValue: 'HU 500'},
    {value: '1000', viewValue: 'HU 1000'}
  ];

  selectedMembership = this.memberShip[0].value;

  campaignOne: FormGroup;
  campaignTwo: FormGroup;

  date = new FormControl(new Date());
  date_ = new Date();


  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;
  today;
  totalDays = 600;
  table = []
  constructor(){


    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16))
    });

    this.campaignTwo = new FormGroup({
      start: new FormControl(new Date(year, month, 15)),
      end: new FormControl(new Date(year, month, 19))
    });

    for( let i = 1; i<=this.totalDays;i++){
        this.table.push({
            date: new Date().setDate(new Date().getDate()+i)
        })
    }
  }

  addEvent(type: string, event) {
    console.log(event.value)
    // this.events.push(`${type}: ${event.value}`);
  }
}
