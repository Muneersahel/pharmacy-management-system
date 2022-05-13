import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor(private router: Router) {}

  navigateToURL(url: string) {
    return this.router.navigateByUrl(url);
  }
}
