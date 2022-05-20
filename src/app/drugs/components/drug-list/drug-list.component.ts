import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ClientEndpoints } from 'src/app/core/enums/endpoints';
import { Drug } from 'src/app/core/interfaces/drug.interface';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DrugService } from '../../services/drug.service';

@Component({
    selector: 'app-drug-list',
    templateUrl: './drug-list.component.html',
    styleUrls: ['./drug-list.component.scss'],
})
export class DrugListComponent implements OnInit, OnDestroy {
    isLoading: boolean = false;
    drugList: Drug[] = [];
    destroy$ = new Subject<void>();

    constructor(
        private utilityS: UtilityService,
        private drugS: DrugService,
        private notificationS: NotificationService
    ) {}

    ngOnInit(): void {
        this.getDrugs();
    }

    getDrugs() {
        this.isLoading = true;
        this.drugS
            .getDrugs()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                this.isLoading = false;
                this.drugList = response.drugs;
            });
    }

    onAddDrug() {
        this.utilityS.navigateToURL(
            ClientEndpoints.DRUGS + ClientEndpoints.CREATE
        );
    }

    onEditDrug(drug: Drug) {
        this.utilityS.navigateToURL(
            `${ClientEndpoints.DRUGS}/${drug.id}${ClientEndpoints.EDIT}`
        );
    }

    onDeleteDrug(drug: Drug) {
        this.drugS
            .deleteDrug(drug.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationS.success('Drug deleted successfully');
                },
                error: (error) => {
                    this.notificationS.error(error.error.message);
                },
            });
    }

    onRestoreDrug(drug: Drug) {
        this.drugS
            .restoreDrug(drug.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationS.success('Drug restored successfully');
                },
                error: (error) => {
                    this.notificationS.error(error.error.message);
                },
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
