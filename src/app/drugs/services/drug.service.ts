import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { ApiEndpoints } from 'src/app/core/enums/endpoints';
import { Drug } from 'src/app/core/interfaces/drug.interface';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DrugService {
    drugList: Drug[] = [];
    private drugsSubject = new BehaviorSubject<any>([]);
    drugs$ = this.drugsSubject.asObservable();

    constructor(private http: HttpClient) {}

    getDrugs() {
        return this.http
            .get<{
                message: string;
                drugs: Drug[];
            }>(`${environment.apiUrl}${ApiEndpoints.DRUGS}`)
            .pipe(
                tap((response) => {
                    this.drugList = response.drugs;
                    this.drugsSubject.next(this.drugList);
                })
            );
    }

    addDrug(formData: FormData) {
        return this.http
            .post<{ message: string; drug: Drug }>(
                `${environment.apiUrl}${ApiEndpoints.DRUGS}`,
                formData
            )
            .pipe(
                tap((response) => {
                    this.drugList.push(response.drug);
                    this.drugsSubject.next(this.drugList);
                })
            );
    }

    updateDrug(formData: FormData, id: number) {
        return this.http
            .put<{ message: string; drug: Drug }>(
                `${environment.apiUrl}${ApiEndpoints.DRUGS}/${id}`,
                formData
            )
            .pipe(
                tap((response) => {
                    this.drugList[id] = response.drug;
                    this.drugsSubject.next(this.drugList);
                })
            );
    }

    deleteDrug(id: number) {
        return this.http
            .delete<{ message: string; drug: Drug }>(
                `${environment.apiUrl}${ApiEndpoints.DRUGS}/${id}`
            )
            .pipe(
                tap((response) => {
                    const index = this.drugList.findIndex(
                        (role) => role.id === response.drug.id
                    );
                    this.drugList[index] = response.drug;
                    this.drugsSubject.next(this.drugList);
                })
            );
    }

    getDrug(id: number) {
        return this.http
            .get<{ message: string; drug: Drug }>(
                `${environment.apiUrl}${ApiEndpoints.DRUGS}/${id}`
            )
            .pipe(
                map((response) => {
                    return response.drug;
                })
            );
    }

    restoreDrug(id: number) {
        return this.http
            .put<{ message: string; drug: Drug }>(
                `${environment.apiUrl}${ApiEndpoints.DRUGS}/${id}/restore`,
                null
            )
            .pipe(
                tap((response) => {
                    const index = this.drugList.findIndex(
                        (role) => role.id === response.drug.id
                    );
                    this.drugList[index] = response.drug;
                    this.drugsSubject.next(this.drugList);
                })
            );
    }
}
