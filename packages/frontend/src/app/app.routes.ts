import { Routes } from '@angular/router'
import { GameModeChallenge } from './features/game/game-mode-challenge/game-mode-challenge'
import { GameModeEducational } from './features/game/game-mode-educational/game-mode-educational'
import { GameModeSandbox } from './features/game/game-mode-sandbox/game-mode-sandbox'
import { GameModeSelect } from './features/game/game-mode-select/game-mode-select'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'games',
    pathMatch: 'full',
  },
  {
    path: 'games',
    component: GameModeSelect,
  },
  {
    path: 'games/sandbox',
    component: GameModeSandbox,
  },
  {
    path: 'games/challenge',
    component: GameModeChallenge,
  },
  {
    path: 'games/educational',
    component: GameModeEducational,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'games',
  },
]
