import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UtilityService {
    isDeviceSmall$: Observable<boolean>;
    constructor(
        private router: Router,
        private breakpointObserver: BreakpointObserver,
        private title: Title
    ) {
        this.isDeviceSmall$ = this.breakpointObserver
            .observe([Breakpoints.XSmall, Breakpoints.Small])
            .pipe(
                map((result) => result.matches),
                shareReplay()
            );
    }

    navigateToURL(url: string) {
        return this.router.navigateByUrl(url);
    }

    setPageTitle(title: string) {
        this.title.setTitle(title + ' - ' + 'Hanim Pharmacy');
    }
}
