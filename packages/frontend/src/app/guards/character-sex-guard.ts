import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { GameStateService } from '../services/game-state'

export const characterSexGuard: CanActivateFn = async () => {
  const gameState = inject(GameStateService)
  const router = inject(Router)

  if (gameState.charSex === undefined) {
    return await router.navigateByUrl('/')
  }

  return true
}
