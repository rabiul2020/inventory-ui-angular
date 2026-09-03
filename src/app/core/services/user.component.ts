import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  RegisterRequest,
  UserDto,
  UpdateUserDto,
  UpdateUserRolesDto,
  RoleDto
} from 'src/app/core/models/features.models';

import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  users: UserDto[] = [];
  roles: RoleDto[] = [];

  userForm!: FormGroup;

  showForm = false;
  editingUserId: string | null = null;
  editingUserRoles: string[] = [];

  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''],
      isActive: [true],
      roles: this.fb.array([])
    });

    this.loadUsers();
    this.loadRoles();
  }

  get roleControls(): FormArray {
    return this.userForm.get('roles') as FormArray;
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Failed to load users:', error);
        this.errorMessage = error?.error?.message || 'Failed to load users.';
      }
    });
  }

  loadRoles(): void {
    this.userService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;

        // Build one checkbox control per role
        this.createRoleControls();

        // If we're editing a user, re-apply their previously selected roles
        if (this.editingUserId !== null) {
          this.setSelectedRoles(this.editingUserRoles);
        }
      },
      error: (error) => {
        console.error('Failed to load roles:', error);
        this.errorMessage = error?.error?.message || 'Failed to load roles.';
      }
    });
  }

  createRoleControls(): void {
    this.roleControls.clear();
    this.roles.forEach(() => {
      this.roleControls.push(this.fb.control(false));
    });
  }

  setSelectedRoles(userRoles: string[]): void {
    this.roles.forEach((role, index) => {
      const selected = userRoles.some(
        userRole => userRole.trim().toLowerCase() === role.name.trim().toLowerCase()
      );
      this.roleControls.at(index).setValue(selected);
    });
  }

  getSelectedRoles(): string[] {
    return this.roles
      .filter((_role, index) => this.roleControls.at(index).value === true)
      .map(role => role.name);
  }

  openUserForm(): void {
    this.editingUserId = null;
    this.editingUserRoles = [];
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userForm.reset({
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      isActive: true
    });

    this.createRoleControls();
  }

  saveUser(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const selectedRoles = this.getSelectedRoles();

    if (selectedRoles.length === 0) {
      this.errorMessage = 'Please select at least one role.';
      return;
    }

    if (this.editingUserId === null) {
      this.createUser(selectedRoles);
    } else {
      this.updateUser(this.editingUserId, selectedRoles);
    }
  }

  private createUser(selectedRoles: string[]): void {
    const password = this.userForm.get('password');
    const confirmPassword = this.userForm.get('confirmPassword');

    if (!password?.value) {
      password?.setErrors({ required: true });
      this.errorMessage = 'Password is required.';
      return;
    }

    if (!confirmPassword?.value) {
      confirmPassword?.setErrors({ required: true });
      this.errorMessage = 'Confirm Password is required.';
      return;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      this.errorMessage = 'Password and Confirm Password do not match.';
      return;
    }

    const request: RegisterRequest = {
      userName: this.userForm.get('userName')?.value,
      email: this.userForm.get('email')?.value,
      password: this.userForm.get('password')?.value,
      confirmPassword: this.userForm.get('confirmPassword')?.value,
      isActive: this.userForm.get('isActive')?.value ?? true
    };

    this.userService.register(request).subscribe({
      next: (userId) => {
        if (selectedRoles.length === 0) {
          this.successMessage = 'User created successfully.';
          this.showForm = false;
          this.loadUsers();
          return;
        }

        const roleRequest: UpdateUserRolesDto = {
          userId,
          roles: selectedRoles
        };

        this.userService.updateRoles(roleRequest).subscribe({
          next: () => {
            this.successMessage = 'User created successfully.';
            this.showForm = false;
            this.loadUsers();
          },
          error: (error) => {
            console.error('Role assignment failed:', error);
            this.errorMessage =
              error?.error?.message || 'User created but roles could not be assigned.';
          }
        });
      },
      error: (error) => {
        console.error('User registration failed:', error);
        this.errorMessage = error?.error?.message || 'Failed to create user.';
      }
    });
  }

  private updateUser(userId: string, selectedRoles: string[]): void {
    const updateRequest: UpdateUserDto = {
      userName: this.userForm.get('userName')?.value,
      email: this.userForm.get('email')?.value,
      isActive: this.userForm.get('isActive')?.value ?? true
    };

    // NOTE: previously this made the update() + updateRoles() call three times
    // in a row (copy-paste bug), causing duplicate/racy PUT requests. Now it
    // runs exactly once.
    this.userService.update(userId, updateRequest).subscribe({
      next: () => {
        const roleRequest: UpdateUserRolesDto = {
          userId,
          roles: selectedRoles
        };

        this.userService.updateRoles(roleRequest).subscribe({
          next: () => {
            this.successMessage = 'User updated successfully.';
            this.showForm = false;
            this.editingUserId = null;
            this.loadUsers();
          },
          error: (error) => {
            console.error('Role update failed:', error);
            this.errorMessage =
              error?.error?.message || 'User updated but roles could not be updated.';
          }
        });
      },
      error: (error) => {
        console.error('User update failed:', error);
        this.errorMessage = error?.error?.message || 'Failed to update user.';
      }
    });
  }

  editUser(id: string): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.showForm = true;

    this.userService.getById(id).subscribe({
      next: (user) => {
        this.editingUserId = user.id;

        this.userForm.patchValue({
          userName: user.userName,
          email: user.email,
          isActive: user.isActive
        });

        // Save existing roles so they can be re-applied once role list loads
        this.editingUserRoles = user.roles || [];

        // If roles are already loaded, apply selection immediately
        if (this.roles.length > 0) {
          this.createRoleControls();
          this.setSelectedRoles(this.editingUserRoles);
        }
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = error?.error?.message || 'Failed to load user.';
        this.showForm = false;
      }
    });
  }
}
