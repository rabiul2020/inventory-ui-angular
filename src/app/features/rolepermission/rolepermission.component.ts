import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PermissionTree, RoleDto } from 'src/app/core/models/features.models';
import { RolePermissionService } from 'src/app/core/services/rolepermission.service';



@Component({
  selector: 'app-rolepermission',
  templateUrl: './rolepermission.component.html',
  styleUrls: ['./rolepermission.component.scss']
})
export class RolepermissionComponent
  implements OnInit {

  permissionTree: PermissionTree[] = [];

  selectedPermissionIds: number[] = [];

  expandedModules: Set<string> =
    new Set<string>();

    roleForm: FormGroup;

editingRoleId: string | null = null;

showForm = false;

successMessage = '';

errorMessage = '';
roles: RoleDto[] = [];

  constructor(
    private rolePermissionService:
      RolePermissionService,
       private fb: FormBuilder,
  )

  {
      this.roleForm =
    this.fb.group({

      name: [
        '',
        Validators.required
      ]

    });

  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissionTree();
  }

  loadRoles(): void
  {

  this.rolePermissionService
    .getRoles()
    .subscribe({

      next: (result) => {

        this.roles = result;

        console.log(
          'Roles:',
          this.roles
        );

      },

      error: (error) => {

        console.error(
          'Failed to load roles:',
          error
        );

      }

    });

}


openRoleForm(): void {

  this.editingRoleId = null;

  this.successMessage = '';

  this.errorMessage = '';

  this.roleForm.reset();

  this.selectedPermissionIds = [];

  this.expandedModules.clear();

  this.showForm = true;

}

closeRoleForm(): void {

  this.showForm = false;

  this.editingRoleId = null;

  this.roleForm.reset();

}


  loadPermissionTree(): void {

    this.rolePermissionService
      .getPermissionTree()
      .subscribe({

        next: (result) => {

          this.permissionTree = result;

          console.log(
            'Permission Tree:',
            this.permissionTree
          );

        },

        error: (error) => {

          console.error(
            'Failed to load permission tree:',
            error
          );

        }

      });

  }


editRole(role: RoleDto): void {

  this.editingRoleId = role.id;

  this.successMessage = '';

  this.errorMessage = '';

  this.selectedPermissionIds = [];

  this.expandedModules.clear();

  this.roleForm.patchValue({
    name: role.name
  });

  this.showForm = true;


  this.rolePermissionService
    .getRolePermissionTree(role.id)
    .subscribe({

      next: (result) => {

        this.permissionTree = result;

        this.selectedPermissionIds =
          result
            .flatMap(module =>
              module.permissions
            )
            .filter(permission =>
              permission.isAssigned
            )
            .map(permission =>
              permission.id
            );

        console.log(
          'Selected Permission IDs:',
          this.selectedPermissionIds
        );

      },

      error: (error) => {

        console.error(
          'Failed to load role permissions:',
          error
        );

      }

    });

}

toggleModule(moduleName: string): void {

  if (
    this.expandedModules.has(moduleName)
  ) {

    this.expandedModules.delete(moduleName);

  } else {

    this.expandedModules.add(moduleName);

  }

}

isModuleExpanded(
  moduleName: string
): boolean {

  return this.expandedModules.has(
    moduleName
  );

}

isPermissionSelected(
  permissionId: number
): boolean {

  return this.selectedPermissionIds
    .includes(permissionId);

}

onPermissionChange(
  permissionId: number,
  event: Event
): void {

  const checkbox =
    event.target as HTMLInputElement;

  if (checkbox.checked) {

    if (
      !this.selectedPermissionIds
        .includes(permissionId)
    ) {

      this.selectedPermissionIds.push(
        permissionId
      );

    }

  } else {

    this.selectedPermissionIds =
      this.selectedPermissionIds.filter(
        id => id !== permissionId
      );

  }

  console.log(
    'Selected Permission IDs:',
    this.selectedPermissionIds
  );

}

createRole(): void {

  if (this.roleForm.invalid) {

    this.roleForm.markAllAsTouched();

    return;

  }


  if (
    this.selectedPermissionIds.length === 0
  ) {

    this.errorMessage =
      'Please select at least one permission.';

    return;

  }


  const roleName =
    this.roleForm.get('name')?.value;


  this.rolePermissionService
    .createRole(roleName)
    .subscribe({

      next: (role) => {

        console.log(
          'Role created:',
          role
        );


        this.rolePermissionService
          .updateRolePermissions(
            role.id,
            this.selectedPermissionIds
          )
          .subscribe({

            next: () => {

               this.loadRoles();

  this.showForm = false;

  this.editingRoleId = null;

  this.roleForm.reset();

  this.selectedPermissionIds = [];

  this.expandedModules.clear();

  this.successMessage =
    'Role updated successfully.';

            },

            error: (error) => {

              console.error(
                'Permission assignment failed:',
                error
              );

              this.errorMessage =
                'Role created but permission assignment failed.';

            }

          });

      },

      error: (error) => {

        console.error(
          'Role creation failed:',
          error
        );

        this.errorMessage =
          'Failed to create role.';

      }

    });

}

updateRole(): void {

  if (!this.editingRoleId) {
    return;
  }

  if (this.roleForm.invalid) {

    this.roleForm.markAllAsTouched();

    return;

  }

  if (this.selectedPermissionIds.length === 0) {

    this.errorMessage =
      'Please select at least one permission.';

    return;

  }

  const roleName =
    this.roleForm.get('name')?.value;


  // Step 1: Update Role Name
  this.rolePermissionService
    .updateRole(
      this.editingRoleId,
      roleName
    )
    .subscribe({

      next: () => {

        // Step 2: Update Permissions
        this.rolePermissionService
          .updateRolePermissions(
            this.editingRoleId!,
            this.selectedPermissionIds
          )
          .subscribe({

            next: () => {

            this.loadRoles();

  this.showForm = false;

  this.editingRoleId = null;

  this.roleForm.reset();

  this.selectedPermissionIds = [];

  this.expandedModules.clear();

  this.successMessage =
    'Role updated successfully.';

            },

            error: (error) => {

              console.error(
                'Permission update failed:',
                error
              );

              this.errorMessage =
                'Role updated but permissions could not be updated.';

            }

          });

      },

      error: (error) => {

        console.error(
          'Role update failed:',
          error
        );

        this.errorMessage =
          'Failed to update role.';

      }

    });

}

saveRole(): void
{

  this.successMessage = '';
  this.errorMessage = '';

  if (this.roleForm.invalid) {

    this.roleForm.markAllAsTouched();

    return;
  }

  if (this.selectedPermissionIds.length === 0) {

    this.errorMessage =
      'Please select at least one permission.';

    return;
  }

  if (this.editingRoleId) {

    // EDIT
    this.updateRole();

  } else {

    // CREATE
    this.createRole();

  }

}
}
