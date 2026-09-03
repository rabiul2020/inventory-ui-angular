
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  CreateSalesReturnRequest,
  Product,
  SalesReturn,
  Sales,
  SalesDetail,
  SalesWiseReturnQty
} from 'src/app/core/models/features.models';

import { SalesService } from
  'src/app/core/services/sales.service';

import { SalesReturnService } from
  'src/app/core/services/salesreturn.service';

@Component({
  selector: 'app-sales-return',
  templateUrl: './salesreturn.component.html',
  styleUrls: ['./salesreturn.component.scss']
})
export class SalesReturnComponent implements OnInit {

  salesReturns: SalesReturn[] = [];

  sales: Sales[] = [];

  products: Product[] = [];

  salesDetails: SalesDetail[] = [];

  salesReturnForm!: FormGroup;

  showForm = false;

  editingSalesReturnId: number | null = null;

  errorMessage = '';

  successMessage = '';

  salesWiseReturnQty: SalesWiseReturnQty[] = [];


  constructor(
    private salesReturnService:
      SalesReturnService,

    private salesService:
      SalesService,

    private fb: FormBuilder
  ) {}


  ngOnInit(): void {

    this.salesReturnForm =
      this.fb.group({

        returnDate: [
          this.formatDate(new Date()),
          Validators.required
        ],

        salesId: [
          0,
          Validators.required
        ],

        customerId: [
          0,
          Validators.required
        ],

        remarks: [''],

        details:
          this.fb.array([])

      });
    this.loadSalesReturns();
    this.loadSales();

  }


  // ==============================
  // FormArray
  // ==============================

  get salesReturnDetails(): FormArray {

    return this.salesReturnForm
      .get('details') as FormArray;

  }


  // ==============================
  // Load Sales Returns
  // ==============================

  loadSalesReturns(): void {

    this.salesReturnService
      .getAll()
      .subscribe({

        next: (returns) => {

          this.salesReturns = returns;

        },

        error: (error) => {

          console.error(
            'Failed to load sales returns:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to load sales returns.';

        }

      });

  }


  // ==============================
  // Load Sales
  // ==============================

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

          this.errorMessage =
            error?.error?.message ||
            'Failed to load sales.';

        }

      });

  }


  // ==============================
  // Open Form
  // ==============================

  openSalesReturnForm(): void {

    this.editingSalesReturnId = null;

    this.showForm = true;

    this.errorMessage = '';

    this.successMessage = '';

    this.salesWiseReturnQty = [];

    this.salesReturnForm.reset({

      returnDate:
        this.formatDate(new Date()),

      salesId: 0,

      customerId: 0,

      remarks: ''

    });

    this.salesReturnDetails.clear();

  }


  // ==============================
  // Sales Change
  // ==============================

  onSalesChange(): void {

    const salesId =
      Number(
        this.salesReturnForm
          .get('salesId')
          ?.value
      );


    this.salesReturnDetails.clear();
    this.salesWiseReturnQty = [];
    this.salesReturnForm.patchValue({
      customerId: 0
    });


    if (!salesId || salesId === 0) {
      return;
    }


    // First get already returned
    // quantity for this sale

    this.salesReturnService
      .getSalesWiseReturnQty(salesId)
      .subscribe({

        next: (result) => {

          this.salesWiseReturnQty =
            result || [];


          // Then load original sale

          this.loadSelectedSale(salesId);

        },

        error: (error) => {

          console.error(
            'Failed to load returned quantities:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to load returned quantities.';

        }

      });

  }


  // ==============================
  // Load Selected Sale
  // ==============================

  private loadSelectedSale(
    salesId: number
  ): void {

    this.salesService
      .getById(salesId)
      .subscribe({

        next: (sale) => {

          this.salesDetails =
            sale.salesDetails;


          this.salesReturnForm.patchValue({

            customerId:
              sale.customerId

          });


          this.salesReturnDetails.clear();


          sale.salesDetails.forEach(
            saleDetail => {

              const alreadyReturned =
                this.getAlreadyReturnedFromApi(
                  saleDetail.productId
                );



              const availableQuantity =
                Math.max(
                  0,
                  saleDetail.quantity -
                  alreadyReturned
                );


                alert('alreadyReturned' + alreadyReturned);

                 alert('availableQuantity'+availableQuantity);


              const detailForm =
                this.fb.group({

                  productId: [
                    saleDetail.productId,
                    Validators.required
                  ],

                  productName: [
                    saleDetail.productName
                  ],

                  soldQuantity: [
                    saleDetail.quantity
                  ],

                  alreadyReturnedQuantity: [
                    alreadyReturned
                  ],

                  availableQuantity: [
                    availableQuantity
                  ],

                  quantity: [
                    0,
                    [
                      Validators.required,
                      Validators.min(0)
                    ]
                  ],

                  unitPrice: [
                    saleDetail.unitPrice,
                    [
                      Validators.required,
                      Validators.min(0)
                    ]
                  ]

                });


              this.salesReturnDetails
                .push(detailForm);

            }
          );

        },

        error: (error) => {

          console.error(
            'Failed to load sale details:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to load sale details.';

        }

      });

  }


  // ==============================
  // Get Already Returned Quantity
  // ==============================

  getAlreadyReturnedFromApi(
    productId: number
  ): number {

    const item =
      this.salesWiseReturnQty.find(
        x =>
          x.productId === productId
      );


    return Number(
      item?.totlReturnQuantity || 0
    );

  }


  // ==============================
  // Available Quantity
  // ==============================

  getAvailableQuantity(
    index: number
  ): number {

    const detail =
      this.salesReturnDetails.at(index);


    return Number(
      detail.get('availableQuantity')
        ?.value
    ) || 0;

  }


  isReturnQuantityInvalid(index: number): boolean {

  const detail =
    this.salesReturnDetails.at(index);

  const quantity =
    Number(
      detail.get('quantity')?.value
    ) || 0;

  const availableQuantity =
    this.getAvailableQuantity(index);

  return quantity > availableQuantity;
}


  // ==============================
  // Quantity Validation
  // ==============================

 /*  validateReturnQuantity(
    index: number
  ): void
{

    const detail =
      this.salesReturnDetails.at(index);


    const quantity =
      Number(
        detail.get('quantity')?.value
      ) || 0;


    const availableQuantity =
      this.getAvailableQuantity(index);


    if (quantity > availableQuantity) {

      detail
        .get('quantity')
        ?.setErrors({
          maxReturnQuantity: true
        });

      return;

    }






    const control =
      detail.get('quantity');


    if (
      control?.hasError(
        'maxReturnQuantity'
      )
    ) {

      control.setErrors(null);

    }

  } */


validateReturnQuantity(
  index: number
): void {

  const detail =
    this.salesReturnDetails.at(index);

  const control =
    detail.get('quantity');

  if (!control) {
    return;
  }

  const quantity =
    Number(control.value) || 0;

  const availableReturnQuantity =
    this.getAvailableQuantity(index);

  if (quantity > availableReturnQuantity) {

    control.setValue(
      availableReturnQuantity
    );

    control.setErrors({
      maxReturnQuantity: true
    });

    return;
  }

  if (control.hasError('maxReturnQuantity')) {

    control.setErrors(null);
  }
}


  hasInvalidReturnQuantity(): boolean {

  for (
    let i = 0;
    i < this.salesReturnDetails.length;
    i++
  ) {

    if (this.isReturnQuantityInvalid(i)) {
      return true;
    }

  }

  return false;
}


  // ==============================
  // Detail Amount
  // ==============================

  getDetailAmount(
    index: number
  ): number {

    const detail =
      this.salesReturnDetails.at(index);


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


  // ==============================
  // Total Amount
  // ==============================

  getTotalAmount(): number {

    let total = 0;


    for (
      let i = 0;
      i < this.salesReturnDetails.length;
      i++
    ) {

      total +=
        this.getDetailAmount(i);

    }


    return total;

  }


  // ==============================
  // Supplier / Customer Name
  // ==============================

  getSelectedCustomerName(): string {

    const salesId =
      Number(
        this.salesReturnForm
          .get('salesId')
          ?.value
      );


    const sale =
      this.sales.find(
        x => x.id === salesId
      );


    return sale?.customerName || '';

  }


  // ==============================
  // Add Detail
  // ==============================

  addSalesReturnDetail(): void {

    const detail =
      this.fb.group({

        productId: [
          0,
          Validators.required
        ],

        productName: [''],

        soldQuantity: [0],

        alreadyReturnedQuantity: [0],

        availableQuantity: [0],

        quantity: [
          0,
          [
            Validators.required,
            Validators.min(0)
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


    this.salesReturnDetails
      .push(detail);

  }


  // ==============================
  // Remove Detail
  // ==============================

  removeSalesReturnDetail(
    index: number
  ): void {

    this.salesReturnDetails
      .removeAt(index);

  }


  // ==============================
  // Save
  // ==============================

  saveSalesReturn(): void {

    if (
      this.salesReturnForm.invalid
    ) {

      this.salesReturnForm.markAllAsTouched();

      return;

    }


    // Validate every row

    for (
      let i = 0;
      i < this.salesReturnDetails.length;
      i++
    ) {

      this.validateReturnQuantity(i);


      if (
        this.salesReturnDetails
          .at(i)
          .get('quantity')
          ?.hasError(
            'maxReturnQuantity'
          )
      ) {

        this.errorMessage =
          'Return quantity cannot exceed available quantity.';

        return;

      }

    }


    const formValue =
      this.salesReturnForm.value;


    const request:
      CreateSalesReturnRequest = {

      returnDate:
        formValue.returnDate,

      salesId:
        Number(formValue.salesId),

      customerId:
        Number(formValue.customerId),

      remarks:
        formValue.remarks || null,

      details:
        formValue.details
          .filter(
            (x: any) =>
              Number(x.quantity) > 0
          )
          .map(
            (x: any) => ({

              productId:
                Number(x.productId),

              quantity:
                Number(x.quantity),

              unitPrice:
                Number(x.unitPrice)

            })
          )

    };


    if (
      request.details.length === 0
    ) {

      this.errorMessage =
        'Please enter at least one return quantity.';

      return;

    }


    // Create

    if (
      this.editingSalesReturnId === null
    ) {

      this.salesReturnService
        .create(request)
        .subscribe({

          next: () => {

            this.successMessage =
              'Sales return created successfully.';

            this.showForm = false;

            this.loadSalesReturns();

          },

          error: (error) => {

            console.error(error);

            this.errorMessage =
              error?.error?.message ||
              'Failed to create sales return.';

          }

        });

      return;

    }


    // Update

    this.salesReturnService
      .update(
        this.editingSalesReturnId,
        request
      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Sales return updated successfully.';

          this.showForm = false;

          this.loadSalesReturns();

        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            error?.error?.message ||
            'Failed to update sales return.';

        }

      });

  }


  // ==============================
  // Edit
  // ==============================

  editSalesReturn(
    id: number
  ): void {

    this.errorMessage = '';

    this.successMessage = '';


    this.salesReturnService
      .getById(id)
      .subscribe({

        next: (salesReturn) => {

          this.editingSalesReturnId =
            salesReturn.id;

          this.showForm = true;


          this.salesReturnForm.patchValue({

            returnDate:
              this.formatDate(
                salesReturn.returnDate
              ),

            salesId:
              salesReturn.salesId,

            customerId:
              salesReturn.customerId,

            remarks:
              salesReturn.remarks || ''

          });


          // Get purchase/sale wise
          // returned quantity from API

          this.salesReturnService
            .getSalesWiseReturnQty(
              salesReturn.salesId
            )
            .subscribe({

              next: (result) => {

                this.salesWiseReturnQty =
                  result || [];


                this.loadSaleForEdit(
                  salesReturn
                );

              },

              error: (error) => {

                console.error(error);

                this.errorMessage =
                  error?.error?.message ||
                  'Failed to load returned quantities.';

              }

            });

        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            error?.error?.message ||
            'Failed to load sales return.';

        }

      });

  }


  // ==============================
  // Load Sale For Edit
  // ==============================

  private loadSaleForEdit(
    salesReturn: SalesReturn
  ): void {

    this.salesService
      .getById(
        salesReturn.salesId
      )
      .subscribe({

        next: (sale) => {

          this.salesDetails =
            sale.salesDetails;


          this.salesReturnDetails.clear();


          sale.salesDetails.forEach(
            saleDetail => {

              const currentReturn =
                salesReturn.details
                  .find(
                    x =>
                      x.productId ===
                      saleDetail.productId
                  );


              const totalReturned =
                this.getAlreadyReturnedFromApi(
                  saleDetail.productId
                );


              // Exclude current
              // return while editing

              const previousReturned =
                Math.max(
                  0,
                  totalReturned -
                  (
                    currentReturn
                      ?.quantity || 0
                  )
                );


              const availableQuantity =
                Math.max(
                  0,
                  saleDetail.quantity -
                  previousReturned
                );

                console.log( 'previousReturned'+previousReturned);
                console.log( 'previousReturned'+ availableQuantity);

              const detailForm =
                this.fb.group({

                  productId: [
                    saleDetail.productId,
                    Validators.required
                  ],

                  productName: [
                    saleDetail.productName
                  ],

                  soldQuantity: [
                    saleDetail.quantity
                  ],

                  alreadyReturnedQuantity: [
                    previousReturned
                  ],

                  availableQuantity: [
                    availableQuantity
                  ],

                  quantity: [
                    currentReturn
                      ?.quantity || 0,

                    [
                      Validators.required,
                      Validators.min(0)
                    ]
                  ],

                  unitPrice: [
                    currentReturn
                      ?.unitPrice ??
                    saleDetail.unitPrice,

                    [
                      Validators.required,
                      Validators.min(0)
                    ]
                  ]

                });


              this.salesReturnDetails
                .push(detailForm);

            }
          );

        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            error?.error?.message ||
            'Failed to load sale details.';

        }

      });

  }


  // ==============================
  // Sales Number
  // ==============================

  getSalesNumber(
    salesId: number
  ): string {

    const sale =
      this.sales.find(
        x => x.id === salesId
      );


    return sale?.salesNumber || '';

  }


  // ==============================
  // Format Date
  // ==============================

  formatDate(
    date: Date | string
  ): string {

    const d =
      new Date(date);


    const year =
      d.getFullYear();


    const month =
      String(
        d.getMonth() + 1
      ).padStart(2, '0');


    const day =
      String(
        d.getDate()
      ).padStart(2, '0');


    return `${year}-${month}-${day}`;

  }


  // ==============================
  // Cancel
  // ==============================

  cancelSalesReturn(): void {

    this.showForm = false;

    this.editingSalesReturnId = null;

    this.salesReturnForm.reset({

      returnDate:
        this.formatDate(new Date()),

      salesId: 0,

      customerId: 0,

      remarks: ''

    });

    this.salesReturnDetails.clear();

  }


  // ==============================
  // Delete
  // ==============================

  deleteSalesReturn(
    id: number
  ): void {

    if (
      !confirm(
        'Are you sure you want to delete this sales return?'
      )
    ) {

      return;

    }


    this.salesReturnService
      .delete(id)
      .subscribe({

        next: () => {

          this.successMessage =
            'Sales return deleted successfully.';

          this.loadSalesReturns();

        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            error?.error?.message ||
            'Failed to delete sales return.';

        }

      });

  }


}
