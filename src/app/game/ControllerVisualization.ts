import { GameButton, GameButtons } from './keyboard-controls.class';
import { Asset } from './sprite.class';


export class ControllerVisualization extends Asset {
  constructor() {
    super();
    this.rect.width = 180;
    this.rect.height = 50;
  }
  buttons: GameButtons = [];
  override draw(ctx: CanvasRenderingContext2D): void {
    this.rect.x = ctx.canvas.width - this.rect.width;
    this.rect.y = ctx.canvas.height - this.rect.height;
    // ctx.fillStyle ='white';
    // ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    // ctx.fillStyle ='black';
    // ctx.fillText(JSON.stringify(this.buttons), this.rect.x + 10, this.rect.y + 20);
    ctx.fillStyle = 'white';
    ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    ctx.fillStyle = 'black';

    const width = this.rect.width;
    const height = this.rect.height;
    const left = this.rect.x;
    const right = left + width;
    const top = this.rect.y;
    const bottom = top + height;

    const center = {
      x: left + (width / 2),
      y: top + (height / 2),
    }

    const b = this.buttons;

    const dPadCenterX = left + width / 4;
    const dPadRadius = (Math.min(height, width) / 5) * 2;

    this.preVisualize(ctx, b, dPadCenterX, center, dPadRadius, right, bottom);
    this.visualize(ctx, b, dPadCenterX, center, dPadRadius, right, bottom);

  }

  private preVisualize(ctx: CanvasRenderingContext2D, b: GameButtons, dPadCenterX: number, center: { x: number; y: number; }, dPadRadius: number, right: number, bottom: number) {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 6;
    ctx.beginPath();

    ctx.moveTo(dPadCenterX, center.y);
    ctx.lineTo(dPadCenterX, center.y - dPadRadius);

    ctx.moveTo(dPadCenterX, center.y);
    ctx.lineTo(dPadCenterX, center.y + dPadRadius);

    ctx.moveTo(dPadCenterX, center.y);
    ctx.lineTo(dPadCenterX - dPadRadius, center.y);

    ctx.moveTo(dPadCenterX, center.y);
    ctx.lineTo(dPadCenterX + dPadRadius, center.y);

    ctx.stroke();

    const actionButtonDiameter = (dPadRadius / 4) * 3;
    const actionButtonRadius = actionButtonDiameter /2;

    ctx.beginPath();
    ctx.arc(right - (3 * dPadRadius), bottom - dPadRadius, actionButtonRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(right - (2 * dPadRadius), bottom - dPadRadius, actionButtonRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(right - (1 * dPadRadius), bottom - dPadRadius, actionButtonRadius, 0, 2 * Math.PI);
    ctx.stroke();
  }
  private visualize(ctx: CanvasRenderingContext2D, b: GameButtons, dPadCenterX: number, center: { x: number; y: number; }, dPadRadius: number, right: number, bottom: number) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 8;
    ctx.beginPath();
    if (b.includes(GameButton.UP)) {
      ctx.moveTo(dPadCenterX, center.y);
      ctx.lineTo(dPadCenterX, center.y - dPadRadius);
    }
    if (b.includes(GameButton.DOWN)) {
      ctx.moveTo(dPadCenterX, center.y);
      ctx.lineTo(dPadCenterX, center.y + dPadRadius);
    }
    if (b.includes(GameButton.LEFT)) {
      ctx.moveTo(dPadCenterX, center.y);
      ctx.lineTo(dPadCenterX - dPadRadius, center.y);
    }
    if (b.includes(GameButton.RIGHT)) {
      ctx.moveTo(dPadCenterX, center.y);
      ctx.lineTo(dPadCenterX + dPadRadius, center.y);
    }
    ctx.stroke();

    const actionButtonDiameter = (dPadRadius / 4) * 3;
    const actionButtonRadius = actionButtonDiameter / 2;


    if (b.includes(GameButton.A)) {
      ctx.beginPath();
      ctx.arc(right - (3 * dPadRadius), bottom - dPadRadius, actionButtonRadius, 0, 2 * Math.PI);
      ctx.stroke();
    }
    if (b.includes(GameButton.B)) {
      ctx.beginPath();
      ctx.arc(right - (2 * dPadRadius), bottom - dPadRadius, actionButtonRadius, 0, 2 * Math.PI);
      ctx.stroke();
    }
    if (b.includes(GameButton.C)) {
      ctx.beginPath();
      ctx.arc(right - (1 * dPadRadius), bottom - dPadRadius, actionButtonRadius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
}
