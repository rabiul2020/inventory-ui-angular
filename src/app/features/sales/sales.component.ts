import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  CreateSaleRequest,
  Customer,
  Product,
  Sales,
  Stock
} from 'src/app/core/models/features.models';

import { SalesService } from 'src/app/core/services/sales.service';
import { CustomerService } from 'src/app/core/services/customer.service';
import { ProductService } from 'src/app/core/services/product.service';
import { StockService } from 'src/app/core/services/stock.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  sales: Sales[] = [];

  salesForm!: FormGroup;

  showForm = false;

  editingSalesId: number | null = null;

  customers: Customer[] = [];

  products: Product[] = [];

  stocks: Stock[] = [];

  errorMessage = '';

  successMessage = '';


  constructor(
    private salesService: SalesService,
    private customerService: CustomerService,
    private productService: ProductService,
    private stockService: StockService,
    private fb: FormBuilder
  ) {}


  ngOnInit(): void {

    this.salesForm = this.fb.group({

      salesDate: [
        this.getTodayDate(),
        Validators.required
      ],

      customerId: [
        0,
        Validators.required
      ],

      invoiceNumber: [''],

      remarks: [''],

      salesDetails: this.fb.array([])

    });


    this.loadCustomers();

    this.loadProducts();

    this.loadStocks();

    this.loadSales();

  }


  // ============================
  // FormArray
  // ============================

  get salesDetails(): FormArray {

    return this.salesForm.get(
      'salesDetails'
    ) as FormArray;

  }


  // ============================
  // Open Add Form
  // ============================

  openSalesForm(): void {

    this.editingSalesId = null;

    this.showForm = true;

    this.errorMessage = '';

    this.successMessage = '';


    this.salesForm.reset({

      salesDate: this.getTodayDate(),

      customerId: 0,

      invoiceNumber: '',

      remarks: ''

    });


    this.salesDetails.clear();

    this.addSalesDetail();

  }


  // ============================
  // Today
  // ============================

  private getTodayDate(): string {

    const today = new Date();

    return today.toISOString().substring(0, 10);

  }


  // ============================
  // Load Sales
  // ============================

  loadSales(): void {

    this.salesService
      .getAll()
      .subscribe({

        next: (sales) => {

          this.sales = sales;

        },

        error: (error) => {

          console.error(
            'Failed to load sales:',
            error
          );

        }

      });

  }


  // ============================
  // Load Customers
  // ============================

  loadCustomers(): void {

    this.customerService
      .getAll()
      .subscribe({

        next: (customers) => {

          this.customers = customers;

        },

        error: (error) => {

          console.error(
            'Failed to load customers:',
            error
          );

        }

      });

  }


  // ============================
  // Load Products
  // ============================

  loadProducts(): void {

    this.productService
      .getAll()
      .subscribe({

        next: (products) => {

          this.products = products;

        },

        error: (error) => {

          console.error(
            'Failed to load products:',
            error
          );

        }

      });

  }


  // ============================
  // Load Stock
  // ============================

  loadStocks(): void {

    this.stockService
      .getAll()
      .subscribe({

        next: (response) => {

          this.stocks = response;

        },

        error: (error) => {

          console.error(
            'Failed to load stocks:',
            error
          );

        }

      });

  }


  // ============================
  // Add Sales Detail
  // ============================

  addSalesDetail(): void {

    const detail = this.fb.group({

      productId: [
        0,
        Validators.required
      ],

      quantity: [
        1,
        [
          Validators.required,
          Validators.min(0.01)
        ]
      ],

      unitPrice: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ]

    });


    this.salesDetails.push(detail);

  }


  // ============================
  // Product Change
  // ============================

  onProductChange(index: number): void {

    const detail =
      this.salesDetails.at(index);

    const productId =
      Number(
        detail.get('productId')?.value
      );


    if (!productId) {

      detail.patchValue({

        quantity: 1,

        unitPrice: 0

      });

      return;

    }


    const product =
      this.products.find(
        x => x.id === productId
      );


    if (product) {

      detail.patchValue({

        unitPrice: product.salePrice

      });

    }

  }


  // ============================
  // Get Stock
  // ============================

  getCurrentStock(index: number): number {

    const detail =
      this.salesDetails.at(index);

    const productId =
      Number(
        detail.get('productId')?.value
      );


    if (!productId) {
      return 0;
    }


    const stock =
      this.stocks.find(
        x => x.productId === productId
      );


    return stock?.currentStock ?? 0;

  }


  // ============================
  // Get Cost Price
  // ============================

  getCostPrice(index: number): number {

    const detail =
      this.salesDetails.at(index);

    const productId =
      Number(
        detail.get('productId')?.value
      );


    if (!productId) {
      return 0;
    }


    const stock =
      this.stocks.find(
        x => x.productId === productId
      );


    return stock?.costPrice ?? 0;

  }


  // ============================
  // Detail Amount
  // ============================

  getDetailAmount(index: number): number {

    const detail =
      this.salesDetails.at(index);


    const quantity =
      Number(
        detail.get('quantity')?.value
      ) || 0;


    const unitPrice =
      Number(
        detail.get('unitPrice')?.value
      ) || 0;


    return quantity * unitPrice;

  }


  // ============================
  // Total Amount
  // ============================

  getTotalAmount(): number {

    let total = 0;


    for (
      let i = 0;
      i < this.salesDetails.length;
      i++
    ) {

      total += this.getDetailAmount(i);

    }


    return total;

  }


  // ============================
  // Remove Detail
  // ============================

  removeSalesDetail(index: number): void {

    this.salesDetails.removeAt(index);

  }


  // ============================
  // Save Sale
  // ============================

  saveSale(): void {

    if (this.salesForm.invalid) {
      return;
    }


    if (this.salesDetails.length === 0) {

      this.errorMessage =
        'Please add at least one product.';

      return;

    }


    this.errorMessage = '';

    this.successMessage = '';


    // Validate stock
    for (
      let i = 0;
      i < this.salesDetails.length;
      i++
    ) {

      const detail =
        this.salesDetails.at(i);

      const productId =
        Number(
          detail.get('productId')?.value
        );

      const quantity =
        Number(
          detail.get('quantity')?.value
        ) || 0;


      const currentStock =
        this.getCurrentStock(i);


      if (quantity > currentStock) {

        this.errorMessage =
          `Insufficient stock. Available stock: ${currentStock}`;

        return;

      }

    }


    const request: CreateSaleRequest = {

      salesDate:
        this.salesForm.get(
          'salesDate'
        )?.value,

      customerId:
        Number(
          this.salesForm.get(
            'customerId'
          )?.value
        ),

      invoiceNumber:
        this.salesForm.get(
          'invoiceNumber'
        )?.value,

      remarks:
        this.salesForm.get(
          'remarks'
        )?.value,

      details:
        this.salesDetails.controls.map(
          detail => ({

            productId:
              Number(
                detail.get(
                  'productId'
                )?.value
              ),

            quantity:
              Number(
                detail.get(
                  'quantity'
                )?.value
              ),

            unitPrice:
              Number(
                detail.get(
                  'unitPrice'
                )?.value
              )

          })
        )

    };


    if (this.editingSalesId !== null) {

      this.updateSale(
        this.editingSalesId,
        request
      );

    }
    else {

      this.createSale(request);

    }

  }


  // ============================
  // Create
  // ============================

  private createSale(
    request: CreateSaleRequest
  ): void {

    this.salesService
      .create(request)
      .subscribe({

        next: (sale) => {

          this.successMessage =
            'Sale created successfully.';

          this.showForm = false;

          this.resetSalesForm();

          this.loadSales();

          this.loadStocks();

        },

        error: (error) => {

          console.error(
            'Failed to create sale:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to create sale.';

        }

      });

  }


  // ============================
  // Update
  // ============================

  private updateSale(
    id: number,
    request: CreateSaleRequest
  ): void {

    this.salesService
      .update(id, request)
      .subscribe({

        next: () => {

          this.successMessage =
            'Sale updated successfully.';

          this.showForm = false;

          this.resetSalesForm();

          this.loadSales();

          this.loadStocks();

        },

        error: (error) => {

          console.error(
            'Failed to update sale:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to update sale.';

        }

      });

  }


  // ============================
  // Edit
  // ============================

  editSale(id: number): void {

    this.salesService
      .getById(id)
      .subscribe({

        next: (sale) => {

          this.editingSalesId =
            sale.id;

          this.showForm = true;

          this.errorMessage = '';

          this.successMessage = '';


          this.salesForm.patchValue({

            salesDate:
              sale.salesDate
                ? sale.salesDate.substring(
                    0,
                    10
                  )
                : '',

            customerId:
              sale.customerId,

            invoiceNumber:
              sale.invoiceNumber ?? '',

            remarks:
              sale.remarks ?? ''

          });


          this.salesDetails.clear();


          sale.salesDetails.forEach(
            detail => {

              const detailForm =
                this.fb.group({

                  productId: [
                    detail.productId,
                    Validators.required
                  ],

                  quantity: [
                    detail.quantity,
                    [
                      Validators.required,
                      Validators.min(0.01)
                    ]
                  ],

                  unitPrice: [
                    detail.unitPrice,
                    [
                      Validators.required,
                      Validators.min(0)
                    ]
                  ]

                });


              this.salesDetails.push(
                detailForm
              );

            }
          );

        },

        error: (error) => {

          console.error(
            'Failed to load sale:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to load sale.';

        }

      });

  }


  // ============================
  // Delete
  // ============================

  deleteSale(id: number): void {

    if (!confirm(
      'Are you sure you want to delete this sale?'
    )) {

      return;

    }


    this.salesService
      .delete(id)
      .subscribe({

        next: () => {

          this.successMessage =
            'Sale deleted successfully.';

          this.loadSales();

          this.loadStocks();

        },

        error: (error) => {

          console.error(
            'Failed to delete sale:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to delete sale.';

        }

      });

  }


  // ============================
  // Reset
  // ============================

  resetSalesForm(): void {

    this.salesForm.reset({

      salesDate:
        this.getTodayDate(),

      customerId: 0,

      invoiceNumber: '',

      remarks: ''

    });


    this.salesDetails.clear();

    this.editingSalesId = null;

  }

  onQuantityChange(index: number): void {

  const detail = this.salesDetails.at(index);

  const quantity =
    Number(detail.get('quantity')?.value) || 0;

  const currentStock =
    this.getCurrentStock(index);

  if (quantity > currentStock) {

    detail.get('quantity')?.setValue(currentStock);

    this.errorMessage =
      `Cannot sell more than available stock. Available stock: ${currentStock}`;

    return;
  }

  if (quantity <= 0) {

    detail.get('quantity')?.setValue(0.01);

  }

  this.errorMessage = '';
}

}
