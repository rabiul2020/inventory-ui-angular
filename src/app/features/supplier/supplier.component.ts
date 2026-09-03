import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Supplier } from 'src/app/core/models/features.models';
import { SupplierService } from 'src/app/core/services/supplier.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  suppliers: Supplier[] = [];
  supplierForm!: FormGroup;
  showForm = false;
  editingSupplierId: number | null = null;
  showDeleteModal = false;
  deleteSupplierId: number | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(
    private supplierService: SupplierService,
      private fb: FormBuilder
  ) {}

  ngOnInit(): void {

    this.supplierForm = this.fb.group({

    name: [
      '',
      Validators.required
    ],

    contactPerson: [''],

    phone: [''],

    email: [
      '',
      Validators.email
    ],

    address: [''],

    isActive: [true]

  });

    this.loadSuppliers();

  }

  loadSuppliers(): void
  {

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

  saveSupplier(): void
  {
    this.errorMessage = '';
    this.successMessage = '';
  if (this.supplierForm.invalid) {
    return;
  }

  const supplier: Supplier = this.supplierForm.value;

  // =========================
  // Edit / Update
  // =========================
  if (this.editingSupplierId !== null) {

    supplier.id = this.editingSupplierId;

    this.supplierService
      .update(
        this.editingSupplierId,
        supplier
      )
      .subscribe({

        next: (updatedSupplier) => {

          console.log(
            'Supplier updated:',
            updatedSupplier
          );
          this.successMessage = 'Supplier updated successfully.';
          this.showForm = false;
          this.editingSupplierId = null;

          this.supplierForm.reset({
            name: '',
            contactPerson: '',
            phone: '',
            email: '',
            address: '',
            isActive: true
          });

          this.loadSuppliers();
        },

        error: (error) => {

          console.error(
            'Failed to update supplier:',
            error
          );

          this.errorMessage =
               error?.error?.message ||
             'Failed to update supplier.';

        }

      });

    return;
  }


  // =========================
  // Add / Create
  // =========================
  this.supplierService
    .create(supplier)
    .subscribe({

      next: (createdSupplier) => {

        console.log(
          'Supplier created:',
          createdSupplier
        );

        this.showForm = false;
        this.successMessage = 'Supplier created successfully.';

        this.supplierForm.reset({
          name: '',
          contactPerson: '',
          phone: '',
          email: '',
          address: '',
          isActive: true
        });

        this.loadSuppliers();
      },

      error: (error) => {

        console.error(
          'Failed to create supplier:',
          error
        );

        this.errorMessage =
        error?.error?.message ||
        'Failed to create supplier.';

      }

    });
}


editSupplier(id: number): void {

  this.supplierService
    .getById(id)
    .subscribe({

      next: (supplier) => {

        console.log(
          'Supplier for edit:',
          supplier
        );

        this.editingSupplierId = supplier.id;

        this.supplierForm.patchValue({
          name: supplier.name,
          contactPerson: supplier.contactPerson,
          phone: supplier.phone,
          email: supplier.email,
          address: supplier.address,
          isActive: supplier.isActive
        });

        this.showForm = true;
      },

      error: (error) => {

        console.error(
          'Failed to load supplier:',
          error
        );

      }

    });
}

deleteSupplier(id: number): void {

  this.deleteSupplierId = id;
  this.showDeleteModal = true;
}

confirmDelete(): void {

  if (this.deleteSupplierId === null) {
    return;
  }

  this.supplierService
    .delete(this.deleteSupplierId)
    .subscribe({

      next: () => {

        console.log(
          'Supplier deleted successfully.'
        );

        this.showDeleteModal = false;
        this.deleteSupplierId = null;

        this.loadSuppliers();
      },

      error: (error) => {

        console.error(
          'Failed to delete supplier:',
          error
        );

      }

    });
}

cancelDelete(): void {

  this.showDeleteModal = false;
  this.deleteSupplierId = null;
}


}
