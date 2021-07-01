import { Component, OnInit, AfterViewInit } from '@angular/core';

import {
  Input,
  Output,
  EventEmitter,
  ViewChild
} from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  pageSize: number;
  pageIndex: number;
  length: number;
  goTo: number;
  pageNumbers: number[];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() dataSource: any ; 
  @Input() disabled = false;
  @Input() hidePageSize = false;
  @Input() pageSizeOptions: number[];
  @Input() showFirstLastButtons = false;
  @Output() page = new EventEmitter<PageEvent>();
  @Input("pageIndex") set pageIndexChanged(pageIndex: number) {
    this.pageIndex = pageIndex;
  }
  @Input("length") set lengthChanged(length: number) {
    this.length = length;
    this.updateGoto();
  }
  @Input("pageSize") set pageSizeChanged(pageSize: number) {
    this.pageSize = pageSize;
    this.updateGoto();
  }

  constructor() {}

  ngAfterContentChecked() {
    // this.dataSource.paginator = this.paginator;
  }

    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    // console.log(this.dataSource, "datasource");
    this.updateGoto();
  }

  updateGoto() {
    this.goTo = (this.pageIndex || 0) + 1;
    this.pageNumbers = [];
    for (let i = 1; i <= Math.ceil(this.length / this.pageSize); i++) {
      this.pageNumbers.push(i);
    }
  }

  paginationChange(pageEvt: PageEvent) {
    this.length = pageEvt.length;
    this.pageIndex = pageEvt.pageIndex;
    this.pageSize = pageEvt.pageSize;
    this.updateGoto();
    this.emitPageEvent(pageEvt);
  }

  goToChange() {
    this.paginator.pageIndex = this.goTo - 1;
    const event: PageEvent = {
      length: this.paginator.length,
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize
    };
    this.paginator.page.next(event);
    this.emitPageEvent(event);
  }

  emitPageEvent(pageEvent: PageEvent) {
    this.page.next(pageEvent);
  }
}
