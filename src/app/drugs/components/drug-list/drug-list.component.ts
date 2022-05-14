import { Component, OnInit } from '@angular/core';
import { ClientEndpoints } from 'src/app/core/enums/endpoints';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
    selector: 'app-drug-list',
    templateUrl: './drug-list.component.html',
    styleUrls: ['./drug-list.component.scss'],
})
export class DrugListComponent implements OnInit {
    isLoading: boolean = false;
    drugList = [];

    constructor(private utilityS: UtilityService) {}

    ngOnInit(): void {}

    onAddDrug() {
        this.utilityS.navigateToURL(
            ClientEndpoints.DRUGS + ClientEndpoints.CREATE
        );
    }
}
