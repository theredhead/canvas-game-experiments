export enum GameButton {
  UP, DOWN, LEFT, RIGHT,
  A, B, C,
}

export type GameButtons = GameButton[];

export interface ControlsMap {
  [key: string]: GameButton;
}

const defaultKeys: ControlsMap = {
  ['ArrowUp']: GameButton.UP,
  ['ArrowDown']: GameButton.DOWN,
  ['ArrowLeft']: GameButton.LEFT,
  ['ArrowRight']: GameButton.RIGHT,
  ['`']: GameButton.A,
  ['z']: GameButton.B,
  ['x']: GameButton.C,

  ['w']: GameButton.UP,
  ['s']: GameButton.DOWN,
  ['a']: GameButton.LEFT,
  ['d']: GameButton.RIGHT,
  [',']: GameButton.A,
  ['.']: GameButton.B,
  ['/']: GameButton.C,
}

export class KeyboardControls {
  constructor(private controls: ControlsMap = defaultKeys) {
  }
  public get state(): GameButtons {
    return this._state;
  }
  private _state: GameButtons = [];
  private started: boolean = false;

  public start() {
    console.log(defaultKeys);
    if (! this.started) {
      this.started = true;
      window.addEventListener('keydown', (e) => this.onKeyDown(e));
      window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }
  }
  public stop() {
    if (this.started) {
      window.removeEventListener('keydown', (e) => this.onKeyDown(e));
      window.removeEventListener('keyup', (e) => this.onKeyUp(e));
      this.started = false;
    }
  }

  onKeyDown(e: KeyboardEvent) {
    e.preventDefault();
    e.cancelBubble = true;
    if (this.controls.hasOwnProperty(e.key)) {
      const button = this.controls[e.key];
      this._state = [...this._state.filter((b) => b !== button), button];
    }
  }
  onKeyUp(e: KeyboardEvent) {
    e.preventDefault();
    e.cancelBubble = true;
    if (this.controls.hasOwnProperty(e.key)) {
      const button = this.controls[e.key];
      this._state = this._state.filter((b) => b !== button);
    }
  }
}
