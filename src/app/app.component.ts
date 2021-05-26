import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  today;
  totalDays = 10;
  table = []
  constructor(){
    for( let i = 1; i<=this.totalDays;i++){
        this.table.push({
            date: new Date().setDate(new Date().getDate()+i)
        })
    }
  }
}
