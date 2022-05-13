import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  getLocalObject(key: string) {
    return JSON.parse(<string>localStorage.getItem(key));
  }

  setLocalObject(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  clearLocalStorage() {
    localStorage.clear();
  }
}
