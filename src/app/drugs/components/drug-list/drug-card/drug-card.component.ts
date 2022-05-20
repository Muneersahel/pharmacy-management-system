import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Drug } from 'src/app/core/interfaces/drug.interface';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-drug-card',
    templateUrl: './drug-card.component.html',
    styleUrls: ['./drug-card.component.scss'],
})
export class DrugCardComponent implements OnInit {
    @Input() drug: Drug = {} as Drug;
    @Output() editEvent = new EventEmitter<Drug>();
    @Output() deleteEvent = new EventEmitter<Drug>();
    @Output() restoreEvent = new EventEmitter<Drug>();

    imageUrl = environment.apiBaseUrl + '/images/';

    constructor() {}

    ngOnInit(): void {}

    onDelete() {
        this.deleteEvent.emit(this.drug);
    }

    onEdit() {
        this.editEvent.emit(this.drug);
    }

    onRestoreDrug() {
        this.restoreEvent.emit(this.drug);
    }
}
