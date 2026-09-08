import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/core/models/features.models';
import { CustomerService } from 'src/app/core/services/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  customers: Customer[] = [];
  customerForm!: FormGroup;
  showForm = false;
  editingCustomerId: number | null = null;
  deletingCustomerId: number | null = null;
  showDeleteModal = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private customerService: CustomerService,
     private fb: FormBuilder
  ) {}

  ngOnInit(): void {

  this.customerForm = this.fb.group({

    name: [
      '',
      Validators.required
    ],

    phone: [''],

    email: [
      '',
      Validators.email
    ],

    address: [''],

    openingBalance: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    isActive: [true]

  });

  this.loadCustomers();
}

saveCustomer(): void
{

  if (this.customerForm.invalid) {
    return;
  }

  this.errorMessage = '';
  this.successMessage = '';

  const customer: Customer = this.customerForm.value;

  // =========================
  // Edit / Update
  // =========================
  if (this.editingCustomerId !== null) {

    customer.id = this.editingCustomerId;

    this.customerService
      .update(
        this.editingCustomerId,
        customer
      )
      .subscribe({

        next: (updatedCustomer) => {

          console.log(
            'Customer updated:',
            updatedCustomer
          );

          this.successMessage =
            'Customer updated successfully.';
          this.showForm = false;
          this.editingCustomerId = null;

          this.resetCustomerForm();

          this.loadCustomers();
        },

        error: (error) => {

          console.error(
            'Failed to update customer:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to update customer.';

        }

      });

    return;
  }


  // =========================
  // Add / Create
  // =========================
  this.customerService
    .create(customer)
    .subscribe({

      next: (createdCustomer) => {

        console.log(
          'Customer created:',
          createdCustomer
        );

        this.successMessage =
          'Customer created successfully.';

        this.showForm = false;

        this.resetCustomerForm();

        this.loadCustomers();
      },

      error: (error) => {

        console.error(
          'Failed to create customer:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Failed to create customer.';

      }

    });
}

resetCustomerForm(): void {

  this.customerForm.reset({

    name: '',

    phone: '',

    email: '',

    address: '',

    openingBalance: 0,

    isActive: true

  });

}


  loadCustomers(): void {

    this.customerService
      .getAll()
      .subscribe({

        next: (customers) => {

          this.customers = customers;

          console.log(
            'Customers:',
            this.customers
          );

        },

        error: (error) => {

          console.error(
            'Failed to load customers:',
            error
          );

        }

      });
  }

  editcustomer(id: number): void {

  this.customerService
    .getById(id)
    .subscribe({

      next: (customer) => {
        this.editingCustomerId = customer.id;
        this.customerForm.patchValue({
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
          isActive: customer.isActive,
          openingBalance:customer.openingBalance
        });

        this.showForm = true;
      },

      error: (error) => {

        console.error(
          'Failed to load Customer:',
          error
        );

      }

    });
}

deletecustomer(id: number): void {

  this.deletingCustomerId = id;
  this.showDeleteModal = true;
}

confirmDelete(): void {

  if (this.deletingCustomerId === null) {
    return;
  }

  this.customerService
    .delete(this.deletingCustomerId)
    .subscribe({

      next: () => {

        console.log(
          'Supplier deleted successfully.'
        );

        this.showDeleteModal = false;
        this.deletingCustomerId = null;

        this.loadCustomers();
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
  this.deletingCustomerId = null;
}


}
