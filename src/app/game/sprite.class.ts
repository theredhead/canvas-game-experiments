import { GameViewComponent } from './../game-view/game-view.component';

export type AssetScript = (asset: IAsset, elapsed: number, world: GameViewComponent) => void;
function randomColor() {
  const colors = ['red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'purple'];
  const ix = Math.floor(Math.random() * colors.length);
  return colors[ix];
}


// export interface IRect {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// }

export class Rect {
  get position() {
    return {
      x: this.x,
      y: this.y
    }
  }
  get size() {
    return {
      width: this.width,
      height: this.height
    }
  }

  get left() {
    return this.y;
  }
  get top() {
    return this.y;
  }
  get right() {
    return this.x + this.width;
  }
  get bottom() {
    return this.y + this.height;
  }

  get centerX() {
    return this.x + (this.width/2)
  }
  get centerY() {
    return this.y + (this.height/2)
  }

  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  intersects(otherRect: Rect) {
    return ! ( otherRect.left > this.right
      || otherRect.right < this.left
      || otherRect.top > this.bottom
      || otherRect.bottom < this.top
    );
  }

  move(deltaX: number, deltaY: number) {
    this.x += deltaX;
    this.y += deltaY;
  }

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  resize(deltaWidth: number, deltaHeight: number) {
    this.width += deltaWidth;
    this.height += deltaHeight;
  }

  resizeTo(width: number, height: number) {
    this.width = width;
    this.height += height;
  }
}

export interface IAsset {
  rect: Rect;
  world: GameViewComponent;
  scripts?: AssetScript[];
  tick(n: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}


export class Asset implements IAsset {
  world!: GameViewComponent;
  rect = new Rect(320, 240, 32, 32);
  scripts: AssetScript[] = [];
  color = randomColor();
  tick(n: number): void {
    for(let script of this.scripts) {
      script(this, n, this.world);
    }
  };
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = 'solid 2px black';
    const r = this.rect;
    ctx.fillRect(r.x, r.y, r.width, r.height);
  }
}

export class Sprite extends Asset {
  private frame = 0;
  state: string = 'default';

  static async fromUrl(url: string): Promise<Sprite> {
    return new Promise((accept, reject) => {
      const image = new Image();
      image.onload = () => {
        createImageBitmap(image).then((bmp: ImageBitmap) => {
          const sprite = new Sprite(bmp);
          accept(sprite);
        }).catch((e) => {
          reject(e);
        });
      };
      image.src = url;
    });
  }
  constructor(private bitmap: ImageBitmap, protected frames: number = 4, readonly states: string[] = ['down', 'left', 'right', 'up']) {
    super();
    this.rect.x = 0;
    this.rect.y = 0;
    this.rect.width = bitmap.width;
    this.rect.height = bitmap.height;
  }

  public ticksPerFrame = 10;
  private ticksThisFrame = 0;
  override tick(n: number): void {
    super.tick(n);
    this.ticksThisFrame ++;
    if (this.ticksThisFrame >= this.ticksPerFrame) {
      this.ticksThisFrame = 0;
      this.frame ++;
      if (this.frame >= this.frames) {
        this.frame = 0;
      }
    }
  }

  override draw(ctx: CanvasRenderingContext2D): void {
    const sx = this.frame * this.rect.width;
    const sy = Math.max(this.states.indexOf(this.state), 0) * this.rect.height;
    const sw = this.rect.width;
    const sh = this.rect.height;

    const dx = this.rect.x;
    const dy = this.rect.y;
    const dw = sw;
    const dh = sh;

    ctx.drawImage(this.bitmap, sx, sy, sw, sh, dx, dy, dw, dh);
  }
}


export const bounce_behavior = (d: number): AssetScript => {
  let velocityX = d;
  let velocityY = d;

  return  (asset: IAsset, elapsed: number, world: GameViewComponent) => {
    const r = asset.rect;
    let distanceX = (velocityX * elapsed) / 100;
    let distanceY = (velocityY * elapsed) / 100;
    if (r.x + r.width + distanceX >= (world.width - r.width) || r.x + distanceX < 0) { velocityX = -1 * velocityX; distanceX = -1 * distanceX}
    if (r.y + distanceY >= (world.height - r.height) || r.y + distanceY < 0) { velocityY = -1 * velocityY; distanceY = -1 * distanceY}

    r.x += distanceX;
    r.y += distanceY;
    // console.log(asset.rect);
  };
};

export const loadImageBitmapFromUrl = async (url: string): Promise<ImageBitmap> => {
  return new Promise((accept, reject) => {
    const image = new Image();
    image.onload = () => {
      createImageBitmap(image).then((bmp: ImageBitmap) => {
        accept(bmp);
      }).catch((e) => {
        reject(e);
      });
    };
    image.src = url;
  });
}



