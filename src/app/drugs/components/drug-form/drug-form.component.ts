import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, take } from 'rxjs';
import { ClientEndpoints } from 'src/app/core/enums/endpoints';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { mimeType } from 'src/app/shared/validators/mime-type.validator';
import { environment } from 'src/environments/environment';
import { DrugService } from '../../services/drug.service';

@Component({
    selector: 'app-drug-form',
    templateUrl: './drug-form.component.html',
    styleUrls: ['./drug-form.component.scss'],
})
export class DrugFormComponent implements OnInit, OnDestroy {
    isLoading: boolean = false;
    drugFormGroup: FormGroup;
    mode = 'create';
    drugId: number | undefined;
    imgPreviewLocalURL: string = '';
    destroy$ = new Subject<void>();
    apiImageUrl = environment.apiBaseUrl + '/assets/images/';

    constructor(
        private utilityS: UtilityService,
        private route: ActivatedRoute,
        private drugS: DrugService,
        private notificationS: NotificationService
    ) {
        this.drugFormGroup = new FormGroup({
            name: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            price: new FormControl('', [
                Validators.required,
                Validators.pattern(/^[0-9]*$/),
            ]),
            image: new FormControl('', {
                validators: [Validators.required],
                asyncValidators: [mimeType],
            }),
        });

        this.route.params.subscribe((params) => {
            if (params['drugId']) {
                this.mode = 'edit';
                this.isLoading = true;
                this.drugId = params['drugId'];
                this.drugS
                    .getDrug(params['drugId'])
                    .pipe(take(1))
                    .subscribe((drug) => {
                        console.log(drug);

                        this.isLoading = false;
                        this.drugFormGroup.setValue({
                            name: drug.name,
                            description: drug.description,
                            price: drug.price,
                            image: drug.image,
                        });
                        this.imgPreviewLocalURL = this.apiImageUrl + drug.image;
                    });
            }
        });
    }

    ngOnInit(): void {}

    backToDrugList() {
        this.utilityS.navigateToURL(ClientEndpoints.DRUGS);
    }

    onImagePicked(event: Event) {
        const target = event.target as HTMLInputElement;
        const files = target.files as FileList;
        this.drugFormGroup.patchValue({ image: files[0] });
        this.drugFormGroup.get('image')?.updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imgPreviewLocalURL = reader.result as string;
        };
        reader.readAsDataURL(files[0]);
    }

    onSubmitDrugForm() {
        if (this.drugFormGroup.invalid) {
            return;
        }

        this.isLoading = true;
        const formData = new FormData();
        formData.append('name', this.drugFormGroup.value.name);
        formData.append('description', this.drugFormGroup.value.description);
        formData.append('price', this.drugFormGroup.value.price);
        formData.append('image', this.drugFormGroup.value.image);

        let drugForm$;

        if (this.mode === 'create') {
            drugForm$ = this.drugS.addDrug(formData);
        } else {
            drugForm$ = this.drugS.updateDrug(formData, this.drugId!);
        }

        drugForm$.pipe(take(1)).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.notificationS.success(response.message);
                this.backToDrugList();
            },
            error: (error) => {
                this.isLoading = false;
                this.notificationS.error(error.error.message);
            },
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
