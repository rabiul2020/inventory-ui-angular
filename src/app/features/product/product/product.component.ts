import { Component, OnInit } from '@angular/core';
import { Category, Product } from 'src/app/core/models/features.models';
import { ProductService } from 'src/app/core/services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  products: Product[] = [];
  productForm!: FormGroup;
  showForm = false;
  editingProductId: number | null = null;
  categories: Category[] = [];
  errorMessage = '';
  successMessage = '';

  showDeleteModal = false;
  deleteProductId: number | null = null;

  constructor(
    private productService: ProductService,private CategoryService:CategoryService,
     private fb: FormBuilder
  ) {}

  ngOnInit(): void
  {

    this.productForm = this.fb.group({

  name: ['', Validators.required],

  code: ['', Validators.required],

  description: [''],

  purchasePrice: [
    0,
    [
      Validators.required,
      Validators.min(0)
    ]
  ],

  salePrice: [
    0,
    [
      Validators.required,
      Validators.min(0)
    ]
  ],

  currentStock: [
    0,
    [
      Validators.required,
      Validators.min(0)
    ]
  ],

  minimumStock: [
    0,
    [
      Validators.required,
      Validators.min(0)
    ]
  ],

  categoryId: [
    0,
    [
      Validators.required,
      Validators.min(1)
    ]
  ]

});
    this.loadProducts();
    this.loadCategories();

  }

  private loadProducts(): void {

    this.productService.getAll().subscribe({

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

/*   saveProduct(): void
  {

  if (this.productForm.invalid) {
    return;
  }

  const product: Product = this.productForm.value;

  this.productService.create(product).subscribe({

    next: (createdProduct) => {

      console.log(
        'Product created:',
        createdProduct
      );

      this.showForm = false;

      this.productForm.reset({
        name: '',
        code: '',
        description: '',
        purchasePrice: 0,
        salePrice: 0,
        currentStock: 0,
        minimumStock: 0,
        categoryId: 0
      });

      this.loadProducts();
    },

    error: (error) => {

      console.error(
        'Failed to create product:',
        error
      );

    }

  });
} */


saveProduct(): void {

  if (this.productForm.invalid) {
    return;
  }

  const product: Product = this.productForm.value;

  // =========================
  // Edit / Update
  // =========================
  if (this.editingProductId !== null) {

    // Ensure product ID is set
    product.id = this.editingProductId;

    this.productService
      .update(this.editingProductId, product)
      .subscribe({

        next: (updatedProduct) => {

          console.log(
            'Product updated:',
            updatedProduct
          );
          this.successMessage = 'Product updated successfully.';
          this.showForm = false;
          this.editingProductId = null;

          this.resetProductForm();

          this.loadProducts();
        },

        error: (error) => {

          console.error(
            'Failed to update product:',
            error
          );

          this.errorMessage =
    error?.error?.message ||
    'Failed to create product.';

        }

      });

    return;
  }

  // =========================
  // Add / Create
  // =========================
  this.productService
    .create(product)
    .subscribe({

      next: (createdProduct) => {

        console.log(
          'Product created:',
          createdProduct
        );

        this.successMessage = 'Product created successfully.';

        this.showForm = false;

        this.resetProductForm();

        this.loadProducts();
      },

      error: (error) => {

        console.error(
          'Failed to create product:',
          error
        );

        this.errorMessage =
    error?.error?.message ||
    'Failed to update product.';

      }

    });
}


// =========================
// Edit Product
// =========================
editProduct(id: number): void {

  this.productService
    .getById(id)
    .subscribe({

      next: (product) => {

        console.log(
          'Product for edit:',
          product
        );

        this.editingProductId = product.id;

        this.productForm.patchValue(product);

        this.showForm = true;
      },

      error: (error) => {

        console.error(
          'Failed to load product:',
          error
        );

      }

    });
}


// =========================
// Reset Form
// =========================
private resetProductForm(): void {

  this.productForm.reset({
    name: '',
    code: '',
    description: '',
    purchasePrice: 0,
    salePrice: 0,
    currentStock: 0,
    minimumStock: 0,
    categoryId: 0
  });
}

loadCategories(): void {

  this.CategoryService
    .getAll()
    .subscribe({

      next: (categories) => {

        this.categories = categories;

      },

      error: (error) => {

        console.error(
          'Failed to load categories:',
          error
        );

      }

    });
}



deleteProduct(id: number): void {

  this.deleteProductId = id;
  this.showDeleteModal = true;
}


/* deleteProduct(id: number): void
{

  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }

  this.productService
    .delete(id)
    .subscribe({

      next: () => {

        console.log(
          'Product deleted successfully.'
        );

        this.loadProducts();
      },

      error: (error) => {

        console.error(
          'Failed to delete product:',
          error
        );

      }

    });
}
 */


confirmDelete(): void {

  if (this.deleteProductId === null) {
    return;
  }

  this.productService
    .delete(this.deleteProductId)
    .subscribe({

      next: () => {

        console.log(
          'Product deleted successfully.'
        );

        this.showDeleteModal = false;
        this.deleteProductId = null;

        this.loadProducts();
      },

      error: (error) => {

        console.error(
          'Failed to delete product:',
          error
        );

      }

    });
}

cancelDelete(): void {

  this.showDeleteModal = false;
  this.deleteProductId = null;
}


}
