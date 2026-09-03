import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  Product,
  StockAdjustment
} from 'src/app/core/models/features.models';

import {
  ProductService
} from 'src/app/core/services/product.service';
import { StockAdjustmentService } from 'src/app/core/services/stockadjustments.service';



@Component({
  selector: 'app-stock-adjustment',
  templateUrl: './stockadjustments.component.html',
  styleUrls: ['./stockadjustments.component.scss']
})
export class StockAdjustmentComponent
  implements OnInit {


  stockAdjustments: StockAdjustment[] = [];

  products: Product[] = [];

  stockAdjustmentForm!: FormGroup;

  showForm = false;

  editingStockAdjustmentId:
    number | null = null;

  errorMessage = '';

  successMessage = '';


  constructor(
    private stockAdjustmentService:
      StockAdjustmentService,

    private productService:
      ProductService,

    private fb: FormBuilder
  ) {}


  ngOnInit(): void {

    this.stockAdjustmentForm =
      this.fb.group({

        adjustmentDate: [
          new Date(),
          Validators.required
        ],

        remarks: [''],

        details:
          this.fb.array([])

      });


    this.loadStockAdjustments();

    this.loadProducts();

  }


  get stockAdjustmentDetails(): FormArray {

    return this.stockAdjustmentForm
      .get('details') as FormArray;

  }


  loadStockAdjustments(): void {

    this.stockAdjustmentService
      .getAll()
      .subscribe({

        next: (adjustments) => {

          this.stockAdjustments =
            adjustments;

          console.log(
            'Stock Adjustments:',
            this.stockAdjustments
          );

        },

        error: (error) => {

          console.error(
            'Failed to load stock adjustments:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to load stock adjustments.';

        }

      });

  }


  loadProducts(): void {

    this.productService
      .getAll()
      .subscribe({

        next: (products) => {

          this.products = products;

          console.log(
            'Products:',
            this.products
          );

        },

        error: (error) => {

          console.error(
            'Failed to load products:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to load products.';

        }

      });

  }


  openStockAdjustmentForm(): void
  {

    this.editingStockAdjustmentId = null;

    this.showForm = true;

    this.errorMessage = '';

    this.successMessage = '';


    this.stockAdjustmentForm.reset({

      adjustmentDate: new Date(),

      remarks: ''

    });


    this.stockAdjustmentDetails.clear();

  }

  addStockAdjustmentDetail(): void
  {

  const detail =
    this.fb.group({

      productId: [
        0,
        Validators.required
      ],

      quantity: [
        0,
        [
          Validators.required,
          Validators.min(0.01)
        ]
      ],

      isIncrease: [
        true,
        Validators.required
      ],

      reason: ['']

    });


  this.stockAdjustmentDetails
    .push(detail);

}

removeStockAdjustmentDetail(
  index: number
): void {

  this.stockAdjustmentDetails
    .removeAt(index);

}

getTotalQuantity(): number {

  let total = 0;

  for (
    let i = 0;
    i < this.stockAdjustmentDetails.length;
    i++
  ) {

    const detail =
      this.stockAdjustmentDetails.at(i);

    const quantity =
      Number(
        detail.get('quantity')?.value
      ) || 0;

    total += quantity;

  }

  return total;

}

saveStockAdjustment(): void {

  this.errorMessage = '';
  this.successMessage = '';


  if (this.stockAdjustmentForm.invalid) {

    this.stockAdjustmentForm
      .markAllAsTouched();

    return;

  }


  if (
    this.stockAdjustmentDetails.length === 0
  ) {

    this.errorMessage =
      'Please add at least one adjustment item.';

    return;

  }


  const formValue =
    this.stockAdjustmentForm.value;


  const request = {

    adjustmentDate:
      formValue.adjustmentDate,

    remarks:
      formValue.remarks || null,

    details:
      formValue.details.map(
        (detail: any) => ({

          productId:
            Number(detail.productId),

          quantity:
            Number(detail.quantity),

          isIncrease:
            detail.isIncrease === true,

          reason:
            detail.reason || null

        })
      )

  };


  console.log(
    'Stock Adjustment Request:',
    request
  );


  // UPDATE
  if (
    this.editingStockAdjustmentId !== null
  ) {

    this.stockAdjustmentService
      .update(
        this.editingStockAdjustmentId,
        request
      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Stock adjustment updated successfully.';

          this.showForm = false;

          this.stockAdjustmentDetails.clear();

          this.editingStockAdjustmentId = null;

          this.loadStockAdjustments();

        },

        error: (error) => {

          console.error(
            'Failed to update stock adjustment:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to update stock adjustment.';

        }

      });

    return;

  }


  // CREATE
  this.stockAdjustmentService
    .create(request)
    .subscribe({

      next: (result) => {

        console.log(
          'Stock Adjustment Created:',
          result
        );

        this.successMessage =
          'Stock adjustment created successfully.';

        this.showForm = false;

        this.stockAdjustmentForm.reset();

        this.stockAdjustmentDetails.clear();

        this.loadStockAdjustments();

      },

      error: (error) => {

        console.error(
          'Failed to create stock adjustment:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Failed to create stock adjustment.';

      }

    });

}
editStockAdjustment(id: number): void
{

  this.errorMessage = '';
  this.successMessage = '';

  this.stockAdjustmentService
    .getById(id)
    .subscribe({

      next: (adjustment) => {

        this.editingStockAdjustmentId =
          adjustment.id;

        this.showForm = true;


        this.stockAdjustmentForm.patchValue({

          adjustmentDate:
            this.formatDate(
              adjustment.adjustmentDate
            ),

          remarks:
            adjustment.remarks || ''

        });


        this.stockAdjustmentDetails.clear();


        adjustment.details.forEach(detail => {

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

              isIncrease: [
                detail.isIncrease,
                Validators.required
              ],

              reason: [
                detail.reason || ''
              ]

            });


          this.stockAdjustmentDetails
            .push(detailForm);

        });

      },

      error: (error) => {

        console.error(
          'Failed to load stock adjustment:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Failed to load stock adjustment.';

      }

    });

}

deleteStockAdjustment(id: number): void {

  this.errorMessage = '';
  this.successMessage = '';


  const confirmed =
    confirm(
      'Are you sure you want to delete this stock adjustment?'
    );


  if (!confirmed) {
    return;
  }


  this.stockAdjustmentService
    .delete(id)
    .subscribe({

      next: () => {

        this.successMessage =
          'Stock adjustment deleted successfully.';

        this.loadStockAdjustments();

      },

      error: (error) => {

        console.error(
          'Failed to delete stock adjustment:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Failed to delete stock adjustment.';

      }

    });

}

formatDate(date: string | Date): string {

  const d = new Date(date);

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


}
