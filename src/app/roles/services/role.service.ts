import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { ApiEndpoints } from 'src/app/core/enums/endpoints';
import { Role } from 'src/app/core/interfaces/role.interface';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    roles: Role[] = [];
    rolesSubject = new Subject<Role[]>();
    constructor(private http: HttpClient) {}

    getRoles() {
        return this.http
            .get<{
                message: string;
                roles: Role[];
            }>(`${environment.apiUrl}${ApiEndpoints.ROLES}`)
            .pipe(
                tap((response) => {
                    this.roles = response.roles;
                    this.rolesSubject.next(this.roles);
                })
            );
    }

    createRole(role: Role) {
        return this.http
            .post<{ message: string; role: Role }>(
                `${environment.apiUrl}${ApiEndpoints.ROLES}`,
                role
            )
            .pipe(
                tap((response) => {
                    this.roles.push(response.role);
                    this.rolesSubject.next(this.roles);
                })
            );
    }

    getRole(id: number) {
        return this.http.get<{ message: string; role: Role }>(
            `${environment.apiUrl}${ApiEndpoints.ROLES}/${id}`
        );
    }

    updateRole(id: number, role: Role) {
        return this.http
            .put<{ message: string; role: Role }>(
                `${environment.apiUrl}${ApiEndpoints.ROLES}/${id}`,
                role
            )
            .pipe(
                tap((response) => {
                    const index = this.roles.findIndex(
                        (role) => role.id === response.role.id
                    );
                    this.roles[index] = response.role;
                    this.rolesSubject.next(this.roles);
                })
            );
    }

    deleteRole(id: number) {
        return this.http
            .delete<{ message: string; role: Role }>(
                `${environment.apiUrl}${ApiEndpoints.ROLES}/${id}`
            )
            .pipe(
                tap((response) => {
                    const index = this.roles.findIndex(
                        (role) => role.id === response.role.id
                    );
                    this.roles[index] = response.role;
                    this.rolesSubject.next(this.roles);
                })
            );
    }

    restoreRole(id: number) {
        return this.http
            .put<{ message: string; role: Role }>(
                `${environment.apiUrl}${ApiEndpoints.ROLES}/${id}/restore`,
                {}
            )
            .pipe(
                tap((response) => {
                    const index = this.roles.findIndex(
                        (role) => role.id === response.role.id
                    );
                    this.roles[index] = response.role;
                    this.rolesSubject.next(this.roles);
                })
            );
    }

    deleteRolePermanently(id: number) {
        return this.http
            .delete<{ message: string; role: Role }>(
                `${environment.apiUrl}${ApiEndpoints.ROLES}/${id}/permanently`
            )
            .pipe(
                tap((response) => {
                    this.roles = this.roles.filter(
                        (role) => role.id !== response.role.id
                    );

                    this.rolesSubject.next(this.roles);
                })
            );
    }
}
