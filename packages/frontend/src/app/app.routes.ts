import { Routes } from '@angular/router'
import { GameModeChallenge } from './features/game/game-mode-challenge/game-mode-challenge'
import { GameModeSelect } from './features/game/game-mode-select/game-mode-select'
import { GameScreen } from './features/game/game-screen/game-screen'
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
    path: NavigationState.GameChallenge,
    component: GameModeChallenge,
  },
  {
    path: NavigationState.GameScreen,
    component: GameScreen,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'games',
  },
]
