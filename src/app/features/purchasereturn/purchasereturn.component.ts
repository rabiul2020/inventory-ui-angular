import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  CreatePurchaseReturnRequest,
  Product,
  PurchaseReturn,
  Purchase,
  PurchaseDetail,
  PurchaseWiseReturnQty
} from 'src/app/core/models/features.models';

import { PurchaseService } from
  'src/app/core/services/purchase.service';

import { PurchaseReturnService } from
  'src/app/core/services/purchasereturn.service';

@Component({
  selector: 'app-purchase-return',
  templateUrl: './purchasereturn.component.html',
  styleUrls: ['./purchasereturn.component.scss']
})
export class PurchaseReturnComponent implements OnInit {

  purchaseReturns: PurchaseReturn[] = [];

  purchases: Purchase[] = [];

  products: Product[] = [];

  purchaseReturnForm!: FormGroup;
  showForm = false;
  editingPurchaseReturnId: number | null = null;
  errorMessage = '';
  successMessage = '';
  purchaseDetails: PurchaseDetail[] = [];
  purchaseWiseReturnQty: PurchaseWiseReturnQty[] = [];


  constructor(
    private purchaseReturnService: PurchaseReturnService,

    private purchaseService: PurchaseService,

    private fb: FormBuilder
  ) {}


  ngOnInit(): void {

    this.purchaseReturnForm = this.fb.group({

      returnDate: [
        this.formatDate(new Date()),
        Validators.required
      ],

      purchaseId: [
        0,
        Validators.required
      ],

      supplierId: [
        0,
        Validators.required
      ],

      remarks: [''],

      details: this.fb.array([])

    });

    this.loadPurchaseReturns();

    this.loadPurchases();
  }


  // ============================================
  // FORM ARRAY
  // ============================================

  get purchaseReturnDetails(): FormArray {

    return this.purchaseReturnForm
      .get('details') as FormArray;
  }


  // ============================================
  // LOAD PURCHASE RETURNS
  // ============================================

  loadPurchaseReturns(): void {

    this.purchaseReturnService
      .getAll()
      .subscribe({

        next: (returns) => {

          this.purchaseReturns = returns;

        },

        error: (error) => {

          console.error(
            'Failed to load purchase returns:',
            error
          );

        }

      });

  }


  // ============================================
  // LOAD PURCHASES
  // ============================================

  loadPurchases(): void {

    this.purchaseService
      .getAll()
      .subscribe({

        next: (purchases) => {

          this.purchases = purchases;

        },

        error: (error) => {

          console.error(
            'Failed to load purchases:',
            error
          );

        }

      });

  }


  // ============================================
  // OPEN NEW FORM
  // ============================================

  openPurchaseReturnForm(): void {

    this.editingPurchaseReturnId = null;

    this.showForm = true;

    this.errorMessage = '';

    this.successMessage = '';

    this.purchaseReturnForm.reset({

      returnDate: this.formatDate(new Date()),

      purchaseId: 0,

      supplierId: 0,

      remarks: ''

    });

    this.purchaseReturnDetails.clear();

  }


  // ============================================
  // PURCHASE CHANGE
  // ============================================

onPurchaseChange(): void
{

  const purchaseId =
    Number(
      this.purchaseReturnForm
        .get('purchaseId')
        ?.value
    );

  // Clear previous details
  this.purchaseReturnDetails.clear();

  this.purchaseDetails = [];

  this.purchaseWiseReturnQty = [];

  // Reset supplier
  this.purchaseReturnForm.patchValue({
    supplierId: 0
  });

  // No purchase selected
  if (!purchaseId || purchaseId === 0) {
    return;
  }


  // ============================================
  // 1. Load Purchase
  // ============================================

  this.purchaseService
    .getById(purchaseId)
    .subscribe({

      next: (purchase) => {

        // Set supplier
        this.purchaseReturnForm.patchValue({
          supplierId: purchase.supplierId
        });

        // Store purchase details
        this.purchaseDetails =
          purchase.purchaseDetails;


        // ========================================
        // 2. Load Purchase-wise Return Quantity
        // ========================================

        this.purchaseReturnService
          .getPurchaseWiseReturn(purchaseId)
          .subscribe({

            next: (result) =>
              {

              this.purchaseWiseReturnQty =
                result;


              console.log(
                'Purchase Wise Return Qty:',
                this.purchaseWiseReturnQty
              );


              // ==================================
              // 3. Create Return Detail Rows
              // ==================================

              purchase.purchaseDetails
                .forEach(detail => {

                  const totalReturned =
                    this.getTotalReturnedQuantity(
                      detail.productId
                    );


                  const detailForm =
                    this.fb.group({

                      productId: [
                        detail.productId,
                        Validators.required
                      ],

                      productName: [
                        detail.productName
                      ],

                      // Already returned quantity
                      returnQuantity: [
                        totalReturned
                      ],

                      // New return quantity
                      quantity: [
                        0,
                        [
                          Validators.required,
                          Validators.min(0)
                        ]
                      ],

                      unitCost: [
                        detail.unitPrice,
                        [
                          Validators.required,
                          Validators.min(0)
                        ]
                      ]

                    });


                  this.purchaseReturnDetails
                    .push(detailForm);

                });

            },

            error: (error) => {

              console.error(
                'Failed to load purchase return quantities:',
                error
              );

              this.errorMessage =
                error?.error?.message ||
                'Failed to load purchase return quantities.';

            }

          });

      },

      error: (error) => {

        console.error(
          'Failed to load purchase:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Failed to load purchase details.';

      }

    });

}


getTotalReturnedQuantity(
  productId: number
): number {

  const purchaseId =
    Number(
      this.purchaseReturnForm
        .get('purchaseId')
        ?.value
    );

  const result =
    this.purchaseWiseReturnQty.find(
      x =>
        x.purchaseId === purchaseId &&
        x.productId === productId
    );

  return result?.totlReturnQuantity ?? 0;
}


  // ============================================
  // ADD DETAIL
  // ============================================

  addPurchaseReturnDetail(
    purchaseDetail?: PurchaseDetail
  ): void {

    const productId =
      purchaseDetail?.productId ?? 0;

    const productName =
      purchaseDetail?.productName ?? '';

    const unitCost =
      purchaseDetail?.unitPrice ?? 0;

    const alreadyReturned =
      this.getTotalReturnedQuantity(
        productId
      );


    const detail = this.fb.group({

      productId: [
        productId,
        Validators.required
      ],

      productName: [
        productName
      ],

      returnQuantity: [
        alreadyReturned
      ],

      quantity: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      unitCost: [
        unitCost,
        [
          Validators.required,
          Validators.min(0)
        ]
      ]

    });


    this.purchaseReturnDetails.push(detail);

  }


  // ============================================
  // REMOVE DETAIL
  // ============================================

  removePurchaseReturnDetail(
    index: number
  ): void {

    this.purchaseReturnDetails
      .removeAt(index);

  }


  // ============================================
  // PURCHASED QUANTITY
  // ============================================

  getPurchasedQuantity(index: number): number {

    const detail =
      this.purchaseReturnDetails.at(index);

    const productId =
      Number(
        detail.get('productId')?.value
      );

    const purchaseDetail =
      this.purchaseDetails.find(
        x => x.productId === productId
      );

    return purchaseDetail?.quantity ?? 0;

  }


  // ============================================
  // ALREADY RETURNED QUANTITY
  // ============================================

  // ============================================
  // VALIDATE RETURN QUANTITY
  // ============================================

  validateReturnQuantity(
    index: number
  ): void {

    const detail =
      this.purchaseReturnDetails.at(index);

    const quantity =
      Number(
        detail.get('quantity')?.value
      ) || 0;

    const productId =
      Number(
        detail.get('productId')?.value
      );

    const purchasedQuantity =
      this.getPurchasedQuantity(index);

    const alreadyReturned =
      this.getTotalReturnedQuantity(
        productId
      );

    const currentReturn =
      this.editingPurchaseReturnId !== null
        ? Number(
            detail.get('returnQuantity')?.value
          ) || 0
        : 0;


    const availableQuantity =
      purchasedQuantity -
      alreadyReturned +
      currentReturn;


    if (quantity > availableQuantity) {

      detail.get('quantity')
        ?.setValue(
          availableQuantity,
          {
            emitEvent: false
          }
        );

      this.errorMessage =
        `Return quantity cannot exceed available quantity. ` +
        `Available: ${availableQuantity}`;

      return;
    }


    this.errorMessage = '';

  }


  // ============================================
  // DETAIL AMOUNT
  // ============================================

  getDetailAmount(index: number): number {

    const detail =
      this.purchaseReturnDetails.at(index);

    const quantity =
      Number(
        detail.get('quantity')?.value
      ) || 0;

    const unitCost =
      Number(
        detail.get('unitCost')?.value
      ) || 0;

    return quantity * unitCost;

  }


  // ============================================
  // TOTAL AMOUNT
  // ============================================

  getTotalAmount(): number {

    let total = 0;

    for (
      let i = 0;
      i < this.purchaseReturnDetails.length;
      i++
    ) {

      total +=
        this.getDetailAmount(i);

    }

    return total;

  }


  // ============================================
  // SAVE / UPDATE
  // ============================================

  savePurchaseReturn(): void {

    if (
      this.purchaseReturnForm.invalid
    ) {

      this.purchaseReturnForm.markAllAsTouched();

      return;

    }


    // Validate every detail
    for (
      let i = 0;
      i < this.purchaseReturnDetails.length;
      i++
    ) {

      this.validateReturnQuantity(i);

      const quantity =
        Number(
          this.purchaseReturnDetails
            .at(i)
            .get('quantity')
            ?.value
        ) || 0;

      if (quantity <= 0) {

        this.errorMessage =
          'Return quantity must be greater than zero.';

        return;

      }

    }


    const formValue =
      this.purchaseReturnForm.value;


    const request:
      CreatePurchaseReturnRequest = {

      returnDate:
        formValue.returnDate,

      purchaseId:
        Number(formValue.purchaseId),

      supplierId:
        Number(formValue.supplierId),

      remarks:
        formValue.remarks,

      details:
        formValue.details.map(
          (detail: any) => ({

            productId:
              Number(detail.productId),

            quantity:
              Number(detail.quantity),

            unitCost:
              Number(detail.unitCost)

          })
        )

    };


    // ============================
    // UPDATE
    // ============================

    if (
      this.editingPurchaseReturnId !== null
    ) {

      this.purchaseReturnService
        .update(
          this.editingPurchaseReturnId,
          request
        )
        .subscribe({

          next: () => {

            this.successMessage =
              'Purchase return updated successfully.';

            this.showForm = false;

            this.loadPurchaseReturns();

          },

          error: (error) => {

            console.error(error);

            this.errorMessage =
              error?.error?.message ||
              'Failed to update purchase return.';

          }

        });

      return;

    }


    // ============================
    // CREATE
    // ============================

    this.purchaseReturnService
      .create(request)
      .subscribe({

        next: () => {

          this.successMessage =
            'Purchase return created successfully.';

          this.showForm = false;

          this.loadPurchaseReturns();

        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            error?.error?.message ||
            'Failed to create purchase return.';

        }

      });

  }


  // ============================================
  // EDIT
  // ============================================

  editPurchaseReturn(id: number): void {

  this.errorMessage = '';
  this.successMessage = '';

  this.purchaseReturnService
    .getById(id)
    .subscribe({

      next: (purchaseReturn) => {

        this.editingPurchaseReturnId =
          purchaseReturn.id;

        this.showForm = true;

        this.purchaseReturnForm.patchValue({

          returnDate:
            this.formatDate(
              purchaseReturn.returnDate
            ),

          purchaseId:
            purchaseReturn.purchaseId,

          supplierId:
            purchaseReturn.supplierId,

          remarks:
            purchaseReturn.remarks || ''

        });


        // -----------------------------------------
        // Step 1: Get purchase-wise return quantity
        // -----------------------------------------

        this.purchaseReturnService
          .getPurchaseWiseReturn(
            purchaseReturn.purchaseId
          )
          .subscribe({

            next: (returnQtyList) => {

              this.purchaseWiseReturnQty =
                returnQtyList;


              // -----------------------------------------
              // Step 2: Get original purchase
              // -----------------------------------------

              this.purchaseService
                .getById(
                  purchaseReturn.purchaseId
                )
                .subscribe({

                  next: (purchase) => {

                    this.purchaseDetails =
                      purchase.purchaseDetails;

                    this.purchaseReturnDetails
                      .clear();


                    // -----------------------------------------
                    // Step 3: Create return detail rows
                    // -----------------------------------------

                    purchase.purchaseDetails
                      .forEach(
                        purchaseDetail => {

                          const returnDetail =
                            purchaseReturn.details
                              .find(
                                x =>
                                  x.productId ===
                                  purchaseDetail.productId
                              );


                          // Quantity of current editing return
                          const currentReturnQty =
                            Number(
                              returnDetail?.quantity
                            ) || 0;


                          // Total returned against this purchase
                          // including current return
                          const totalReturnedQty =
                            this.getTotalReturnedQuantity(
                              purchaseDetail.productId
                            );


                          // Already returned quantity
                          // excluding current editing return
                          const alreadyReturnedQty =
                            Math.max(
                              0,
                              totalReturnedQty -
                              currentReturnQty
                            );


                          const detailForm =
                            this.fb.group({

                              productId: [
                                purchaseDetail.productId,
                                Validators.required
                              ],

                              productName: [
                                purchaseDetail.productName
                              ],

                              // already return quantity
                              returnQuantity: [
                                alreadyReturnedQty
                              ],

                              // User edits this quantity
                              quantity: [
                                currentReturnQty,
                                [
                                  Validators.required,
                                  Validators.min(0)
                                ]
                              ],

                              unitCost: [
                                returnDetail?.unitCost ??
                                purchaseDetail.unitPrice,

                                [
                                  Validators.required,
                                  Validators.min(0)
                                ]
                              ]

                            });


                          this.purchaseReturnDetails
                            .push(detailForm);


                          console.log(
                            'Product:',
                            purchaseDetail.productName,
                            'Purchased:',
                            purchaseDetail.quantity,
                            'Total Returned:',
                            totalReturnedQty,
                            'Current Return:',
                            currentReturnQty,
                            'Already Returned:',
                            alreadyReturnedQty
                          );

                        }
                      );

                  },

                  error: (error) => {

                    console.error(error);

                    this.errorMessage =
                      error?.error?.message ||
                      'Failed to load purchase details.';

                  }

                });

            },

            error: (error) => {

              console.error(error);

              this.errorMessage =
                error?.error?.message ||
                'Failed to load purchase return quantities.';

            }

          });

      },

      error: (error) => {

        console.error(error);

        this.errorMessage =
          error?.error?.message ||
          'Failed to load purchase return.';

      }

    });

}

  // ============================================
  // DELETE
  // ============================================

  deletePurchaseReturn(id: number): void {

    if (
      !confirm(
        'Are you sure you want to delete this purchase return?'
      )
    ) {
      return;
    }


    this.purchaseReturnService
      .delete(id)
      .subscribe({

        next: () => {

          this.successMessage =
            'Purchase return deleted successfully.';

          this.loadPurchaseReturns();

        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            error?.error?.message ||
            'Failed to delete purchase return.';

        }

      });

  }


  // ============================================
  // PURCHASE NUMBER
  // ============================================

  getPurchaseNumber(
    purchaseId: number
  ): string {

    const purchase =
      this.purchases.find(
        x => x.id === purchaseId
      );

    return purchase?.purchaseNumber || '';

  }


  // ============================================
  // SUPPLIER NAME
  // ============================================

  getSelectedSupplierName(): string {

    const purchase =
      this.purchases.find(
        x =>
          x.id ===
          Number(
            this.purchaseReturnForm
              .get('purchaseId')
              ?.value
          )
      );

    return purchase?.supplierName || '';

  }


  // ============================================
  // DATE FORMAT
  // ============================================

  private formatDate(
    date: string | Date
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

}
