import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { NavigationState } from '../../../models/navigation.enum'

@Component({
  selector: 'app-game-mode-educational',
  imports: [],
  templateUrl: './game-mode-educational.html',
  styleUrl: './game-mode-educational.scss',
})
export class GameModeEducational {
  private readonly _router = inject(Router)

  goBack() {
    return this._router.navigate([NavigationState.SelectGame])
  }
}
