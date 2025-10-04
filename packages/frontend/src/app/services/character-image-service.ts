import { inject, Injectable } from '@angular/core'
import { Sex } from '../models/sex.enum'
import { GameStateService } from './game-state'

@Injectable({
  providedIn: 'root',
})
export class CharacterImageService {
  private readonly _gameState = inject(GameStateService)

  getImagePathForCurrentCharacter() {
    const sex = this._gameState.charSex
    const stageOfLife = this._gameState.stageOfLife

    const textSex = sex === Sex.Woman ? 'woman' : 'man'

    return `assets/character_${textSex}_${stageOfLife}.png`
  }
}
