import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-navigation-layout',
  templateUrl: './navigation-layout.component.html',
  styleUrls: ['./navigation-layout.component.scss'],
})
export class NavigationLayoutComponent implements OnInit {
  isDeviceSmall$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isDeviceSmall$ = this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(
        map((result) => result.matches),
        shareReplay()
      );
  }

  ngOnInit(): void {}

  closeDrawer(drawer: any) {
    this.isDeviceSmall$.subscribe((isDeviceSmall) => {
      console.log(isDeviceSmall);

      if (isDeviceSmall) {
        drawer.close();
      }
    });
  }
}
