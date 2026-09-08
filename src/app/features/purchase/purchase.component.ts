import { Component, OnInit } from '@angular/core';
import { CreatePurchaseRequest, Product, Purchase, Supplier } from 'src/app/core/models/features.models';
import { PurchaseService } from 'src/app/core/services/purchase.service';
import {FormBuilder,FormGroup,Validators,FormArray} from '@angular/forms';
import { ProductService } from 'src/app/core/services/product.service';
import { SupplierService } from 'src/app/core/services/supplier.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  purchases: Purchase[] = [];

  purchaseForm!: FormGroup;
  showForm = false;
  editingPurchaseId: number | null = null;
  suppliers: Supplier[] = [];
  products: Product[] = [];
  errorMessage = '';
  successMessage = '';
  showDeleteModal = false;
  deletingPurchaseId: number | null = null;


  constructor(
    private purchaseService: PurchaseService,
  private supplierService: SupplierService,
  private productService: ProductService,
  private fb: FormBuilder
  ) {}

  ngOnInit(): void {

    this.purchaseForm = this.fb.group({

  purchaseDate: [
    new Date(),
    Validators.required
  ],

  supplierId: [
    0,
    Validators.required
  ],

  invoiceNumber: [''],

  remarks: [''],

  PurchaseDetails: this.fb.array([])

});

this.loadSuppliers();

this.loadProducts();

this.loadPurchases();

  }

   get purchaseDetails(): FormArray {

  return this.purchaseForm.get('PurchaseDetails') as FormArray;

  }

  openPurchaseForm(): void
  {

  this.editingPurchaseId = null;

  this.showForm = true;

  this.purchaseForm.reset({

    purchaseDate: new Date(),

    supplierId: 0,

    invoiceNumber: '',

    remarks: ''

  });

  this.purchaseDetails.clear();

  this.addPurchaseDetail();
}

  loadPurchases(): void {

    this.purchaseService
      .getAll()
      .subscribe({

        next: (purchases) => {

          this.purchases = purchases;

          console.log(
            'Purchases:',
            this.purchases
          );

        },

        error: (error) => {

          console.error(
            'Failed to load purchases:',
            error
          );

        }

      });
  }

  loadSuppliers(): void {

  this.supplierService
    .getAll()
    .subscribe({

      next: (suppliers) => {

        this.suppliers = suppliers;

        console.log(
          'Suppliers:',
          this.suppliers
        );

      },

      error: (error) => {

        console.error(
          'Failed to load suppliers:',
          error
        );

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

      }

    });
}

addPurchaseDetail(): void
{

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

  this.purchaseDetails.push(detail);
}

getDetailAmount(index: number): number {

  const detail = this.purchaseDetails.at(index);

  const quantity =
    Number(detail.get('quantity')?.value) || 0;

  const unitPrice =
    Number(detail.get('unitPrice')?.value) || 0;

  return quantity * unitPrice;
}

getTotalAmount(): number {

  let total = 0;

  for (let i = 0; i < this.purchaseDetails.length; i++) {

    const detail = this.purchaseDetails.at(i);

    const quantity =
      Number(detail.get('quantity')?.value) || 0;

    const unitPrice =
      Number(detail.get('unitPrice')?.value) || 0;

    const amount =
      quantity * unitPrice;

    total = total + amount;
  }

  return total;
}

savePurchase(): void {

  if (this.purchaseForm.invalid) {
    return;
  }

  if (this.purchaseDetails.length === 0) {
    this.errorMessage = 'Please add at least one product.';
    return;
  }

  this.errorMessage = '';
  this.successMessage = '';

  const request: CreatePurchaseRequest = {

    purchaseDate:
      this.purchaseForm.get('purchaseDate')?.value,

    supplierId:
      Number(this.purchaseForm.get('supplierId')?.value),

    invoiceNumber:
      this.purchaseForm.get('invoiceNumber')?.value,

    remarks:
      this.purchaseForm.get('remarks')?.value,

    details:
      this.purchaseDetails.controls.map(detail => ({

        productId:
          Number(detail.get('productId')?.value),

        quantity:
          Number(detail.get('quantity')?.value),

        unitPrice:
          Number(detail.get('unitPrice')?.value)

      }))

  };


  // =========================
  // UPDATE
  // =========================

  if (this.editingPurchaseId !== null) {

    this.purchaseService
      .update(this.editingPurchaseId, request)
      .subscribe({

        next: () => {

          this.successMessage =
            'Purchase updated successfully.';

          this.showForm = false;

          this.resetPurchaseForm();

          this.editingPurchaseId = null;

          this.loadPurchases();

        },

        error: (error) => {

          console.error(
            'Failed to update purchase:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to update purchase.';

        }

      });

    return;
  }


  // =========================
  // CREATE
  // =========================

  this.purchaseService
    .create(request)
    .subscribe({

      next: (purchase) => {

        console.log(
          'Purchase created:',
          purchase
        );

        this.successMessage =
          'Purchase created successfully.';

        this.showForm = false;

        this.resetPurchaseForm();

        this.loadPurchases();

      },

      error: (error) => {

        console.error(
          'Failed to create purchase:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Failed to create purchase.';

      }

    });
}

deletePurchase(id: number): void {

  this.deletingPurchaseId = id;

  this.showDeleteModal = true;

}

removePurchaseDetail(index: number): void {

  this.purchaseDetails.removeAt(index);

}


resetPurchaseForm(): void
{

  this.purchaseForm.reset({

    purchaseDate: new Date(),

    supplierId: 0,

    invoiceNumber: '',

    remarks: ''

  });

  this.purchaseDetails.clear();

}

editPurchase(id: number): void {

  this.purchaseService
    .getById(id)
    .subscribe({

      next: (purchase) => {

        this.editingPurchaseId = purchase.id;

        this.showForm = true;

        this.purchaseForm.patchValue({

            purchaseDate: purchase.purchaseDate
            ? purchase.purchaseDate.substring(0, 10)
           : '',

          supplierId: purchase.supplierId,

          invoiceNumber: purchase.invoiceNumber ?? '',

          remarks: purchase.remarks ?? ''

        });


        // Clear existing rows
        this.purchaseDetails.clear();


        // Load existing purchase details
        purchase.purchaseDetails.forEach(detail => {

          const detailForm = this.fb.group({

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

          this.purchaseDetails.push(detailForm);

        });

      },

      error: (error) => {

        console.error(
          'Failed to load purchase:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Failed to load purchase.';

      }

    });
}

confirmDelete(): void {

  if (this.deletingPurchaseId === null) {
    return;
  }

  this.purchaseService
    .delete(this.deletingPurchaseId)
    .subscribe({

      next: () => {

        console.log(
          'Purchase deleted successfully.'
        );

        this.showDeleteModal = false;
        this.deletingPurchaseId = null;

        this.loadPurchases();
      },

      error: (error) => {

        console.error(
          'Failed to delete Purchase:',
          error
        );

      }

    });
}

cancelDelete(): void {

  this.showDeleteModal = false;
  this.deletingPurchaseId = null;
}



}
