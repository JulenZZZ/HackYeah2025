import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { NavigationState } from '../../../models/navigation.enum'

@Component({
  selector: 'app-game-mode-challenge',
  imports: [],
  templateUrl: './game-mode-challenge.html',
  styleUrl: './game-mode-challenge.scss',
})
export class GameModeChallenge {
  private readonly _router = inject(Router)

  goBack() {
    return this._router.navigate([NavigationState.SelectGame])
  }
}
