import { NgFor } from '@angular/common'
import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { ChallengeCategory } from '../../../models/challenge-category.enum'
import { NavigationState } from '../../../models/navigation.enum'
import { GameStateService } from '../../../services/game-state'

@Component({
  selector: 'app-game-mode-challenge',
  imports: [NgFor],
  templateUrl: './game-mode-challenge.html',
  styleUrl: './game-mode-challenge.scss',
})
export class GameModeChallenge {
  private readonly _router = inject(Router)
  private readonly _gameState = inject(GameStateService)

  public get challenges(): string[] {
    return this.getSupportedChallenges()
  }

  getSupportedChallenges(): string[] {
    const values = Object.values(ChallengeCategory).filter(
      (val) => typeof val !== 'number'
    )

    return values
  }

  selectChallenge(category: string) {
    const challengeValue: number | undefined =
      ChallengeCategory[category as keyof typeof ChallengeCategory]

    if (challengeValue === undefined) {
      console.error(`Nieprawidłowa nazwa kategorii wyzwania: ${category}`)
      return
    }

    this._gameState.setChallengeCategory(challengeValue)

    return this._router.navigate([NavigationState.GameScreen])
  }

  goBack() {
    return this._router.navigate([NavigationState.SelectGame])
  }
}
