import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { NavigationState } from '../../../models/navigation.enum'

@Component({
  selector: 'app-game-mode-sandbox',
  imports: [],
  templateUrl: './game-mode-sandbox.html',
  styleUrl: './game-mode-sandbox.scss',
})
export class GameModeSandbox {
  private readonly _router = inject(Router)

  goBack() {
    return this._router.navigate([NavigationState.SelectGame])
  }
}
