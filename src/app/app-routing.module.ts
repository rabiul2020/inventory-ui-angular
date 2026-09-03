import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
//import { LayoutComponent } from './shared/components/layout/layout.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { ProductComponent } from './features/product/product/product.component';
import { CategoryComponent } from './features/category/category.component';
import { SupplierComponent } from './features/supplier/supplier.component';
import { CustomerComponent } from './features/customer/customer.component';
import { PurchaseComponent } from './features/purchase/purchase.component';
import { SalesComponent } from './features/sales/sales.component';
import { PurchaseReturnComponent } from './features/purchasereturn/purchasereturn.component';
import { SalesReturnComponent } from './features/salesreturn/salesreturn.component';
import { StockComponent } from './features/stock/stock.component';
import { StockAdjustmentComponent } from './features/stockadjustments/stockadjustments.component';
import { UserComponent } from './features/user/user.component';
import { RolepermissionComponent } from './features/rolepermission/rolepermission.component';
const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
      path: 'products',
      component: ProductComponent
      },
      {
      path: 'categories',
      component: CategoryComponent
     },
     {
     path: 'suppliers',
     component: SupplierComponent
     },
     {
     path: 'customers',
     component: CustomerComponent
     },
     {
    path: 'purchase',
    component: PurchaseComponent
    },
    {
    path: 'sales',
    component: SalesComponent
    },
    {
      path:'purchase-return',
      component:PurchaseReturnComponent
    },
    {
      path:'sales-return',
      component:SalesReturnComponent
    },
    {
      path:'stock',
      component:StockComponent
    },
    {
      path:'stock-adjustment',
      component:StockAdjustmentComponent
    },
    {
      path:'users',
      component:UserComponent
    },
    {
      path:'roles',
      component:RolepermissionComponent
    }

    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
