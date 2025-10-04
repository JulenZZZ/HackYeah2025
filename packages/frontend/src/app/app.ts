import { Component } from '@angular/core'
import { GameModeSelect } from './features/game-mode-select/game-mode-select'

@Component({
  selector: 'app-root',
  imports: [GameModeSelect],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'frontend'
}
