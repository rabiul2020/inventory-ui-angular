import { Component, OnInit } from '@angular/core';
import { DashboardSummary, RecentTransaction, LowStockProduct } from 'src/app/core/models/features.models';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent
  implements OnInit {

  summary: DashboardSummary | null = null;

  recentTransactions:
    RecentTransaction[] = [];

  lowStockProducts:
    LowStockProduct[] = [];

  loading = false;

  errorMessage = '';

  constructor(
    private dashboardService: DashboardService
  ) {}


  ngOnInit(): void {

    this.loadDashboard();

  }


  loadDashboard(): void {

    this.loading = true;

    this.errorMessage = '';


    this.dashboardService
      .getSummary()
      .subscribe({

        next: (result) => {

          this.summary = result;

        },

        error: (error) => {

          console.error(
            'Dashboard summary error:',
            error
          );

          this.errorMessage =
            'Failed to load dashboard summary.';

        }

      });


    this.dashboardService
      .getRecentTransactions(10)
      .subscribe({

        next: (result) => {

          this.recentTransactions =
            result;

        },

        error: (error) => {

          console.error(
            'Recent transactions error:',
            error
          );

        }

      });


    this.dashboardService
      .getLowStockProducts()
      .subscribe({

        next: (result) => {

          this.lowStockProducts =
            result;

        },

        error: (error) => {

          console.error(
            'Low stock error:',
            error
          );

        },

        complete: () => {

          this.loading = false;

        }

      });

  }

}
