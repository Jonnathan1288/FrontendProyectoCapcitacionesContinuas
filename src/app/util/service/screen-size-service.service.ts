import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  public onResize = new EventEmitter<{ width: number, height: number }>();

  constructor() {
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.onResize.emit({ width, height });
    });
  }

  public getCurrentSize(): { width: number, height: number } {
    return { width: window.innerWidth, height: window.innerHeight };
  }
}