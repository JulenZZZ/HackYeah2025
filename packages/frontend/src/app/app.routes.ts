import { Routes } from '@angular/router'
import { GameModeChallenge } from './features/game/game-mode-challenge/game-mode-challenge'
import { GameModeEducational } from './features/game/game-mode-educational/game-mode-educational'
import { GameModeSandbox } from './features/game/game-mode-sandbox/game-mode-sandbox'
import { GameModeSelect } from './features/game/game-mode-select/game-mode-select'
import { SelectCharacter } from './features/select-character/select-character'
import { StartMenu } from './features/start-menu/start-menu'
import { NavigationState } from './models/navigation.enum'

export const routes: Routes = [
  {
    path: NavigationState.Home,
    component: StartMenu,
  },
  {
    path: NavigationState.SelectCharacter,
    component: SelectCharacter,
  },
  {
    path: NavigationState.SelectGame,
    component: GameModeSelect,
  },
  {
    path: NavigationState.GameSandbox,
    component: GameModeSandbox,
  },
  {
    path: NavigationState.GameChallenge,
    component: GameModeChallenge,
  },
  {
    path: NavigationState.GameEducational,
    component: GameModeEducational,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'games',
  },
]
