import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { NavigationState } from '../../models/navigation.enum'

@Component({
  selector: 'app-start-menu',
  imports: [],
  templateUrl: './start-menu.html',
  styleUrl: './start-menu.scss',
})
export class StartMenu {
  private readonly _router = inject(Router)

  appName = 'Wirtualne Jutro'

  selectChar() {
    return this._router.navigate([NavigationState.SelectCharacter])
  }
}
