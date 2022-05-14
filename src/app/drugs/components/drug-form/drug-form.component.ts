import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientEndpoints } from 'src/app/core/enums/endpoints';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { mimeType } from 'src/app/shared/validators/mime-type.validator';

@Component({
    selector: 'app-drug-form',
    templateUrl: './drug-form.component.html',
    styleUrls: ['./drug-form.component.scss'],
})
export class DrugFormComponent implements OnInit {
    isLoading: boolean = false;
    drugFormGroup: FormGroup;
    mode = 'create';
    imgPreviewLocalURL: string = '';

    constructor(private utilityS: UtilityService) {
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
        console.log(this.drugFormGroup.value);
    }
}
