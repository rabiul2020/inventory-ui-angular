import { Component, OnInit } from '@angular/core';

import {
  Stock
} from 'src/app/core/models/features.models';

import {
  StockService
} from 'src/app/core/services/stock.service';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {

  stocks: Stock[] = [];

  errorMessage = '';

  constructor(
    private stockService: StockService
  ) {}


  ngOnInit(): void {

    this.loadStocks();

  }


  loadStocks(): void {

    this.stockService
      .getAll()
      .subscribe({

        next: (response) => {

          this.stocks = response;

          console.log(
            'Stocks:',
            this.stocks
          );

        },

        error: (error) => {

          console.error(
            'Failed to load stocks:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to load stocks.';

        }

      });

  }

}
