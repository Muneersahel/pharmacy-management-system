import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject, tap } from 'rxjs';
import { ApiEndpoints } from 'src/app/core/enums/endpoints';
import { User } from 'src/app/core/interfaces/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    userList: User[] = [];
    userListSubject = new Subject<User[]>();

    constructor(private http: HttpClient) {}

    getUsers() {
        return this.http
            .get<{
                message: string;
                data: { count: number; users: User[] };
            }>(`${environment.apiUrl}${ApiEndpoints.USERS}`)
            .pipe(
                tap((response) => {
                    this.userList = response.data.users;
                    this.userListSubject.next(this.userList);
                })
            );
    }

    createUser(user: User) {
        return this.http
            .post<{ message: string; user: User }>(
                `${environment.apiUrl}${ApiEndpoints.USERS}`,
                user
            )
            .pipe(
                tap((response) => {
                    this.userList.push(response.user);
                    this.userListSubject.next(this.userList);
                })
            );
    }

    getUser(id: number) {
        return this.http
            .get<{ message: string; user: User }>(
                `${environment.apiUrl}${ApiEndpoints.USERS}/${id}`
            )
            .pipe(
                map((response) => {
                    return response.user;
                })
            );
    }

    updateUser(user: User, id?: number) {
        let url = `${environment.apiUrl}${ApiEndpoints.USERS}`;
        id ? (url += `/${id}`) : null;
        return this.http.put<{ message: string; user: User }>(url, user).pipe(
            tap((response) => {
                console.log(response);
                if (response.user) {
                    const index = this.userList.findIndex(
                        (user) => user.id === response.user.id
                    );
                    this.userList[index] = response.user;
                    this.userListSubject.next(this.userList);
                }
            })
        );
    }

    deleteUser(id: number) {
        return this.http
            .delete<{ message: string; user: User }>(
                `${environment.apiUrl}${ApiEndpoints.USERS}/${id}`
            )
            .pipe(
                tap((response) => {
                    if (response.user) {
                        const index = this.userList.findIndex(
                            (user) => user.id === response.user.id
                        );
                        this.userList.splice(index, 1);
                        this.userListSubject.next(this.userList);
                    }
                })
            );
    }
}
