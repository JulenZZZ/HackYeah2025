import { NgFor } from '@angular/common'
import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { GameMode } from '../../../models/game-mode.enum'

@Component({
  selector: 'app-game-mode-select',
  imports: [NgFor],
  templateUrl: './game-mode-select.html',
  styleUrl: './game-mode-select.scss',
})
export class GameModeSelect {
  private readonly _router = inject(Router)

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

  clickOnModeToSelect(mode: string): void {
    const modeAsUrlParam = mode.toLowerCase()

    this._router.navigate(['games', modeAsUrlParam])
  }
}
