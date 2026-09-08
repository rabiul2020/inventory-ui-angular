

export interface Product {
  id: number;
  name: string;
  code: string;
  description?: string;
  purchasePrice: number;
  salePrice: number;
  currentStock: number;
  minimumStock: number;
  categoryId: number;
  categoryName?: string;
}

export interface Category {
  id: number;
  name: string;
}


export interface Supplier {

  id: number;

  name: string;

  contactPerson?: string;

  phone?: string;

  email?: string;

  address?: string;

  isActive: boolean;

}

export interface Customer {

  id: number;

  name: string;

  phone?: string;

  email?: string;

  address?: string;

  openingBalance: number;

  isActive: boolean;

}

export interface PurchaseDetail {

  productId: number;

  productName: string;

  quantity: number;

  unitPrice: number;

}


export interface Purchase {

  id: number;

  purchaseNumber: string;

  purchaseDate: string;

  supplierId: number;

  supplierName: string;

  totalAmount: number;

  invoiceNumber?: string;

  remarks?: string;

  purchaseDetails: PurchaseDetail[];

}

export interface CreatePurchaseDetailRequest {

  productId: number;

  quantity: number;

  unitPrice: number;

}


export interface CreatePurchaseRequest {

  purchaseDate: string;

  supplierId: number;

  invoiceNumber?: string;

  remarks?: string;

  details: CreatePurchaseDetailRequest[];

}

export interface SalesDetail {

  productId: number;

  productName: string;

  quantity: number;

  unitPrice: number;

  totalPrice: number;

}


export interface Sales {

  id: number;

  salesNumber: string;

  salesDate: string;

  customerId: number;

  customerName: string;

  totalAmount: number;

  invoiceNumber?: string;

  remarks?: string;

  salesDetails: SalesDetail[];

}


export interface CreateSaleDetailRequest {

  productId: number;

  quantity: number;

  unitPrice: number;

}


export interface CreateSaleRequest {

  salesDate: string;

  customerId: number;

  invoiceNumber?: string;

  remarks?: string;

  details: CreateSaleDetailRequest[];

}


export interface Stock {
  productId: number;
  productName: string;
  currentStock: number;
  costPrice: number;
}


export interface PurchaseReturnDetail {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitCost: number;
  totalPrice: number;
}

export interface PurchaseReturn {
  id: number;
  returnNumber: string;
  returnDate: string;
  purchaseId: number;
  supplierId: number;
  supplierName: string;
  totalAmount: number;
  remarks?: string;
  details: PurchaseReturnDetail[];
}

export interface CreatePurchaseReturnDetailRequest {
  productId: number;
  quantity: number;
  unitCost: number;
}

export interface CreatePurchaseReturnRequest {
  returnDate: string;
  purchaseId: number;
  supplierId: number;
  remarks?: string;
  details: CreatePurchaseReturnDetailRequest[];
}

export interface PurchaseWiseReturnQty {
  purchaseId: number;
  productId: number;
  totlReturnQuantity: number;
}

export interface SalesReturnDetail {

  id: number;

  productId: number;

  productName: string;

  quantity: number;

  unitPrice: number;

  totalPrice: number;

}


export interface SalesReturn {

  id: number;

  returnNumber: string;

  returnDate: string;

  salesId: number;

  customerId: number;

  customerName: string;

  totalAmount: number;

  remarks?: string;

  details: SalesReturnDetail[];

}


export interface CreateSalesReturnDetailRequest {

  productId: number;

  quantity: number;

  unitPrice: number;

}


export interface CreateSalesReturnRequest {

  returnDate: string;

  salesId: number;

  customerId: number;

  remarks?: string;

  details: CreateSalesReturnDetailRequest[];

}


export interface SalesWiseReturnQty {

  salesId: number;

  productId: number;

  totlReturnQuantity: number;

}


export interface StockAdjustmentDetail {

  id: number;

  productId: number;

  productName: string;

  quantity: number;

  isIncrease: boolean;

  reason?: string;

}


export interface StockAdjustment {

  id: number;

  adjustmentNumber: string;

  adjustmentDate: string;

  remarks?: string;

  totalQuantity: number;

  details: StockAdjustmentDetail[];

}


export interface CreateStockAdjustmentDetailRequest {

  productId: number;

  quantity: number;

  isIncrease: boolean;

  reason?: string;

}


export interface CreateStockAdjustmentRequest {

  adjustmentDate: string;

  remarks?: string;

  details: CreateStockAdjustmentDetailRequest[];

}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  isActive: boolean;
}


export interface UserDto {
  id: string;
  userName: string;
  email: string;
  roles: string[];
  isActive: boolean;
}


export interface UpdateUserDto {
  userName: string;
  email: string;
  isActive: boolean;
}


export interface UpdateUserRolesDto {
  userId: string;
  roles: string[];
}

export interface RoleDto {
  id: string;
  name: string;
}


export interface Permission {

  id: number;

  name: string;

  code: string;

  module: string;

  isAssigned: boolean;

}

export interface PermissionTree {

  module: string;

  permissions: Permission[];

}


export interface DashboardSummary {

  totalProducts: number;

  totalCustomers: number;

  totalSuppliers: number;

  totalStockQuantity: number;

  totalStockValue: number;

  todayPurchase: number;

  todaySales: number;

  todayPurchaseReturn: number;

  todaySalesReturn: number;

  lowStockProducts: number;

}

export interface RecentTransaction {

  transactionType: string;

  transactionId: number;

  transactionNumber: string;

  transactionDate: string;

  amount: number;

}

export interface LowStockProduct {

  productId: number;

  productName: string;

  currentQuantity: number;

  minimumStockLevel: number;

}
