import { AfterViewInit, Component, ElementRef, HostListener } from "@angular/core";

@Component({
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements AfterViewInit {
  viewWidth = 640;
  viewHeight = 480;

  constructor(private host: ElementRef<HTMLElement>) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.onResize();
    }, 1);
  }

  @HostListener('window:resize') onResize() {
    const rect = this.host.nativeElement.getBoundingClientRect();
    this.viewWidth = rect.width;
    this.viewHeight = rect.height;
    console.log('resized to', {w: this.viewWidth, h: this.viewHeight})
  }
}
