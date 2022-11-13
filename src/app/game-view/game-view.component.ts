import { GameButton, GameButtons, KeyboardControls } from './../game/keyboard-controls.class';
import { IAsset, bounce_behavior, Sprite, Rect, loadImageBitmapFromUrl } from './../game/sprite.class';
import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ControllerVisualization } from '../game/ControllerVisualization';


export class Player extends Sprite {
  private controls!: KeyboardControls;
  private velocity = { x: 0, y: 0 };
  private maxVelocity = { x: 2, y: 2 };
  private velocityDelta = .25;

  static async create(controls: KeyboardControls, world: GameViewComponent): Promise<Player> {
    // const root = '/assets/Sithjester/';
    const root = '/assets/Sithjester/Sithjester_Sprites_Books_and_Movies/Books-Movies/Star-Wars/';

    const bitmap = await loadImageBitmapFromUrl(root + 'sithjester_marajade.png');
    const player = new Player(bitmap);

    player.rect.x = 0;
    player.rect.y = 0;
    player.frames = 4;
    player.rect.width = bitmap.width / 4;
    player.rect.height = bitmap.height / 4;


    player.controls = controls;

    return player;
  }

  override tick(n: number): void {
    const b = [...this.controls.state];
    this.determineMovement(b);
    this.applyMovement(n);
    super.tick(n);
  }

  override draw(ctx: CanvasRenderingContext2D): void {

    // const r = new Rect(ctx.canvas.width - 200, 0, 200, 50);
    // ctx.fillStyle = 'white';
    // ctx.fillRect(r.left, r.top, r.width, r.height);
    // ctx.fillStyle = 'black';
    // ctx.fillText(JSON.stringify({
    //   v: Math.max(this.velocity.x, this.velocity.y), h: this.rect.height
    // }), r.left, r.centerY);

    super.draw(ctx);
  }

  towardsZero(n: number, delta: number): number {
    if (n > 0) {
      return Math.max(0, n - Math.abs(delta));
    } else {
      return Math.min(0, n + Math.abs(delta));
    }
  }
  awayFromZero(n: number, delta: number): number {
    if (n > 0) {
      return n - Math.abs(delta);
    } else {
      return n + Math.abs(delta);
    }
  }

  determineMovement(buttons: GameButtons) {
    let moving = false;
    if (buttons.includes(GameButton.LEFT)) {
      this.velocity.x -= this.velocityDelta;
      moving = true;
    }
    if (buttons.includes(GameButton.RIGHT)) {
      this.velocity.x += this.velocityDelta;
      moving = true;
    }
    if (buttons.includes(GameButton.UP)) {
      this.velocity.y -= this.velocityDelta;
      moving = true;
    };
    if (buttons.includes(GameButton.DOWN)) {
      this.velocity.y += this.velocityDelta;
      moving = true;
    };

    if (! moving) {
      this.velocity.x = this.towardsZero(this.velocity.x, this.velocityDelta);
      this.velocity.y = this.towardsZero(this.velocity.y, this.velocityDelta);
    }

    this.state = Math.abs(this.velocity.x) > Math.abs(this.velocity.y)
      ? (this.velocity.x < 0 ? 'left' : 'right')
      : (this.velocity.y < 0 ? 'up': 'down' )
  }
  applyMovement(elapsed: number) {
    if (this.velocity.x > 0) {
      if (this.velocity.x > this.maxVelocity.x) {
        this.velocity.x = this.maxVelocity.x;
      }
    } else {
      if (this.velocity.x < -1 * this.maxVelocity.x) {
        this.velocity.x = -1 * this.maxVelocity.x;
      }
    }
    if (this.velocity.y > 0) {
      if (this.velocity.y > this.maxVelocity.y) {
        this.velocity.y = this.maxVelocity.y;
      }
    } else {
      if (this.velocity.y < -1 * this.maxVelocity.y) {
        this.velocity.y = -1 * this.maxVelocity.y;
      }
    }
    this.rect.move(elapsed * this.velocity.x, elapsed * this.velocity.y);

    if (this.rect.x < 0) this.rect.x = 0;
    if (this.rect.y < 0) this.rect.y = 0;
    if (this.rect.x > this.world.width-this.rect.width) this.rect.x = this.world.width-this.rect.width;
    if (this.rect.y > this.world.height-this.rect.height) this.rect.y = this.world.height-this.rect.height;

  }
}

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>
  @Input() background: string = '/assets/grass.jpg';

  @Input() width = 640;
  @Input() height = 400;

  private ctx!: CanvasRenderingContext2D;
  private _assets: IAsset[] = [];
  private backgroundImageBitmap?: ImageBitmap;
  private keyboardControls = new KeyboardControls();
  private visualizer = new ControllerVisualization();

  addAsset(asset: IAsset) {
    asset.world = this;
    this._assets.push(asset);
  }

  async ngOnInit() {
    if (this.background) {
      this.backgroundImageBitmap = await loadImageBitmapFromUrl(this.background);
    }
  }
  async ngAfterViewInit() {
    await this.generateCharacters();
    this.initializeDrawingContext();
    this.addAsset(this.visualizer);
    this.keyboardControls.start();

    this.visualizer.scripts.push(() => {
      this.visualizer.buttons = this.keyboardControls.state;
    })

    const player = await Player.create(this.keyboardControls, this);
    player.rect.x = (window.innerWidth / 2) - (player.rect.width / 2)
    player.rect.y = (window.innerWidth / 2) - (player.rect.height / 2)
    this.addAsset(player);

    this.draw(0);
  }

  private last = 0;
  private async generateCharacters() {
    const files = ["sithjester_anakin.png", "sithjester_asajjventress.png", "sithjester_astromechdroid.png", "sithjester_astromechdroid2.png", "sithjester_aurrasing.png", "sithjester_barrissoffee.png", "sithjester_bith.png", "sithjester_breatonnika.png", "sithjester_chewie.png", "sithjester_chiss1.png", "sithjester_chiss2.png", "sithjester_darthmaul.png", "sithjester_darthsidious.png", "sithjester_darthvader.png", "sithjester_falleen1.png", "sithjester_falleen2.png", "sithjester_guri.png", "sithjester_hansolo.png", "sithjester_imperial.png", "sithjester_jacen.png", "sithjester_jaina.png", "sithjester_jawa.png", "sithjester_jedi.png", "sithjester_jedi2.png", "sithjester_lando.png", "sithjester_luke.png", "sithjester_luminaraunduli.png", "sithjester_lynme.png", "sithjester_mandalorian.png", "sithjester_mandalorian2.png", "sithjester_obiwan1.png", "sithjester_obiwan2.png", "sithjester_oola.png", "sithjester_padme.png", "sithjester_palpatine.png", "sithjester_princessleia.png", "sithjester_protocoldroid1.png", "sithjester_protocoldroid2.png", "sithjester_rebelpilot.png", "sithjester_sennitonnika.png", "sithjester_shaakti.png", "sithjester_sith.png", "sithjester_sith2.png", "sithjester_slaveleia.png", "sithjester_stormtrooper.png", "sithjester_tenelka.png", "sithjester_tuskenraider.png", "sithjester_twilek.png", "sithjester_yoda.png", "sithjester_yuuzhenvong.png", "sithjester_zabrak1.png", "sithjester_zabrak2.png"];
    const characters: Sprite[] = [];
    for (let file of files) {
      const sprite = await Sprite.fromUrl('/assets/Sithjester/Sithjester_Sprites_Books_and_Movies/Books-Movies/Star-Wars/' + file);
      characters.push(sprite);
      sprite.rect.width = sprite.rect.width / 4;
      sprite.rect.height = sprite.rect.height / 4;
      sprite.rect.x = Math.floor(Math.random() * (this.width - sprite.rect.width));
      sprite.rect.y = Math.floor(Math.random() * (this.height - sprite.rect.height));
      sprite.scripts.push(bounce_behavior(1 + (Math.random() * 5)));
      this.addAsset(sprite);
    }
  }

  draw(n: number) {
    const elapsed = n - this.last;
    this.last = n;

    // console.log(n);
    for(let asset of this._assets) {
      asset.tick(elapsed);
    }
    // this._assets.sort((a, b) => a.rect.y < b.rect.y ? -1 : 1 );
    if (this.backgroundImageBitmap) {
      this.ctx.drawImage(this.backgroundImageBitmap, 0, 0, this.width, this.height);
    } else {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    for(let asset of this._assets) {
      asset.draw(this.ctx);
    }
    this.ctx.fillStyle = 'black';
    this.ctx.strokeStyle = 'black';
    this.ctx.font = '16pt sans-serif';

    const fps = Math.floor(1000 / elapsed);
    this.ctx.fillText(String(fps), 5, 25);

    requestAnimationFrame((n) => {
      // console.log(n);
      this.draw(n);
    })
  }

  private initializeDrawingContext() {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (ctx) {
      this.ctx = ctx;
    } else {
      throw new Error('Cannot get 2d drawing context');
    }
  }
}
