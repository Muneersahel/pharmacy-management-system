import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Input,
    EventEmitter,
    Output,
} from '@angular/core';
import { UtilityService } from '../../services/utility.service';

@Component({
    selector: 'app-simple-page',
    templateUrl: './simple-page.component.html',
    styleUrls: ['./simple-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimplePageComponent implements OnInit {
    @Input() title: string = '';
    @Input() subtitle?: string;
    @Input() number?: string;
    @Input() icon?: string;
    @Input() buttonText: string = '';
    @Input() centerText?: boolean = false;
    @Input() buttonDisabled?: boolean = false;
    @Input() route?: string | undefined;
    @Output() buttonEvent = new EventEmitter();

    constructor(private utilityS: UtilityService) {}

    ngOnInit(): void {}

    buttonClicked() {
        if (this.route) {
            this.utilityS.navigateToURL(this.route);
        } else {
            this.buttonEvent.emit();
        }
    }
}
