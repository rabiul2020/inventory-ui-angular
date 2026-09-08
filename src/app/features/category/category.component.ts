import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/core/models/features.models';
import { CategoryService } from 'src/app/core/services/category.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categories: Category[] = [];
  categoryForm!: FormGroup;
  showForm = false;
  editingCategoryId: number | null = null;
  showDeleteModal = false;
  deleteCategoryId: number | null = null;

  constructor(
    private categoryService: CategoryService,
     private fb: FormBuilder
  ) {}

  ngOnInit(): void {

      this.categoryForm = this.fb.group({
    name: ['', Validators.required]
  });
    this.loadCategories();

  }

  loadCategories(): void
  {

    this.categoryService
      .getAll()
      .subscribe({

        next: (categories) => {

          this.categories = categories;

          console.log(
            'Categories:',
            this.categories
          );

        },

        error: (error) => {

          console.error(
            'Failed to load categories:',
            error
          );

        }

      });
  }

/*  saveCategory(): void
 {

  if (this.categoryForm.invalid) {
    return;
  }

  const category: Category = this.categoryForm.value;

  this.categoryService
    .create(category)
    .subscribe({

      next: (createdCategory) => {

        console.log(
          'Category created:',
          createdCategory
        );

        this.showForm = false;

        this.categoryForm.reset({
          name: ''
        });

        this.loadCategories();
      },

      error: (error) => {

        console.error(
          'Failed to create category:',
          error
        );

      }

    });
} */

saveCategory(): void {

  if (this.categoryForm.invalid) {
    return;
  }

  const category: Category = this.categoryForm.value;

  // =========================
  // Edit / Update
  // =========================
  if (this.editingCategoryId !== null) {

    category.id = this.editingCategoryId;

    this.categoryService
      .update(
        this.editingCategoryId,
        category
      )
      .subscribe({

        next: (updatedCategory) => {

          console.log(
            'Category updated:',
            updatedCategory
          );

          this.showForm = false;
          this.editingCategoryId = null;

          this.categoryForm.reset({
            name: ''
          });

          this.loadCategories();
        },

        error: (error) => {

          console.error(
            'Failed to update category:',
            error
          );

        }

      });

    return;
  }

  // =========================
  // Add / Create
  // =========================
  this.categoryService
    .create(category)
    .subscribe({

      next: (createdCategory) => {

        console.log(
          'Category created:',
          createdCategory
        );

        this.showForm = false;

        this.categoryForm.reset({
          name: ''
        });

        this.loadCategories();
      },

      error: (error) => {

        console.error(
          'Failed to create category:',
          error
        );

      }

    });
}

editCategory(id: number): void {

  this.categoryService
    .getById(id)
    .subscribe({

      next: (category) => {

        console.log(
          'Category for edit:',
          category
        );

        this.editingCategoryId = category.id;

        this.categoryForm.patchValue(category);

        this.showForm = true;
      },

      error: (error) => {

        console.error(
          'Failed to load category:',
          error
        );

      }

    });
}

deleteCategory(id: number): void {

  this.deleteCategoryId = id;
  this.showDeleteModal = true;
}

confirmDelete(): void {

  if (this.deleteCategoryId === null) {
    return;
  }

  this.categoryService
    .delete(this.deleteCategoryId)
    .subscribe({

      next: () => {

        console.log(
          'Category deleted successfully.'
        );

        this.showDeleteModal = false;
        this.deleteCategoryId = null;

        this.loadCategories();
      },

      error: (error) => {

        console.error(
          'Failed to delete category:',
          error
        );

      }

    });
}

cancelDelete(): void {

  this.showDeleteModal = false;
  this.deleteCategoryId = null;
}

}
