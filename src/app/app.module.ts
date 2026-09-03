import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './features/auth/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { ProductComponent } from './features/product/product/product.component';
import { CategoryComponent } from './features/category/category.component';
import { SupplierComponent } from './features/supplier/supplier.component';
import { CustomerComponent } from './features/customer/customer.component';
import { CommonModule } from '@angular/common';
import { PurchaseComponent } from './features/purchase/purchase.component';
import { SalesComponent } from './features/sales/sales.component';
import { PurchaseReturnComponent } from 'src/app/features/purchasereturn/purchasereturn.component';
import { SalesReturnComponent } from './features/salesreturn/salesreturn.component';
import { StockComponent } from './features/stock/stock.component';
import { StockAdjustmentComponent } from './features/stockadjustments/stockadjustments.component';
import { UserComponent } from './features/user/user.component';
import { RolepermissionComponent } from './features/rolepermission/rolepermission.component';
import { HeaderComponent } from './shared/components/header/header.component';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    LayoutComponent,
    ProductComponent,
    CategoryComponent,
    SupplierComponent,
    CustomerComponent,
    PurchaseComponent,
    SalesComponent,
    PurchaseReturnComponent,
    SalesReturnComponent,
    StockComponent,
    StockAdjustmentComponent,
    UserComponent,
    RolepermissionComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
