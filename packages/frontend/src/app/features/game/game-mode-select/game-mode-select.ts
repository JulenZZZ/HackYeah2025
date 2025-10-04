import { NgFor } from '@angular/common'
import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { GameMode } from '../../../models/game-mode.enum'
import { NavigationState } from '../../../models/navigation.enum'
import { GameStateService } from '../../../services/game-state'

@Component({
  selector: 'app-game-mode-select',
  imports: [NgFor],
  templateUrl: './game-mode-select.html',
  styleUrl: './game-mode-select.scss',
})
export class GameModeSelect {
  private readonly _router = inject(Router)
  private readonly _gameState = inject(GameStateService)

  goToChallengeSelection() {
    return this._router.navigate([NavigationState.GameChallenge])
  }

  goToSandboxMode() {
    this._gameState.setGameMode(GameMode.Sandbox)

    return this._router.navigate([NavigationState.GameScreen])
  }

  goToEducationMode() {
    this._gameState.setGameMode(GameMode.Educational)

    return this._router.navigate([NavigationState.GameScreen])
  }

  goBack() {
    return this._router.navigate([NavigationState.SelectCharacter])
  }
}
