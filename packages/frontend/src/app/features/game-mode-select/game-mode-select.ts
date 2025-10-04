import { NgFor } from '@angular/common'
import { Component } from '@angular/core'
import { GameMode } from '../../models/game-mode.enum'

@Component({
  selector: 'app-game-mode-select',
  imports: [NgFor],
  templateUrl: './game-mode-select.html',
  styleUrl: './game-mode-select.scss',
})
export class GameModeSelect {
  constructor() {
    this.getSupportedModes()
  }

  public get modes(): string[] {
    return this.getSupportedModes()
  }

  getSupportedModes(): string[] {
    const values = Object.values(GameMode).filter(
      (val) => typeof val !== 'number'
    )

    return values
  }
}
