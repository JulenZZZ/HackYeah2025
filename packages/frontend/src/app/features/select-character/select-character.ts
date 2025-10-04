import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { NavigationState } from '../../models/navigation.enum'
import { Sex } from '../../models/sex.enum'
import { GameStateService } from '../../services/game-state'

@Component({
  selector: 'app-select-character',
  imports: [],
  templateUrl: './select-character.html',
  styleUrl: './select-character.scss',
})
export class SelectCharacter {
  private readonly _gameState = inject(GameStateService)
  private readonly _router = inject(Router)

  selectCharacter(sex: Sex) {
    this._gameState.setCharSex(sex)

    return this._router.navigate([NavigationState.SelectGame])
  }

  goBack() {
    return this._router.navigate([NavigationState.Home])
  }
}
