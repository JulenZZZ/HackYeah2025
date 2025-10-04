import { Injectable } from '@angular/core'
import { ChallengeCategory } from '../models/challenge-category.enum'
import { GameMode } from '../models/game-mode.enum'
import { Sex } from '../models/sex.enum'
import { StageOfLife } from '../models/stage-of-life.enum'

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private _charSex: Sex | undefined
  private _gameMode: GameMode | undefined
  private _challengeCategory: ChallengeCategory | undefined
  private _stageOfLife: StageOfLife | undefined

  get charSex(): Sex | undefined {
    return this._charSex
  }

  setCharSex(sex: Sex) {
    this._charSex = sex
  }

  get gameMode() {
    return this._gameMode
  }

  setGameMode(gameMode: GameMode) {
    this._gameMode = gameMode
  }

  get challengeCategory() {
    return this._challengeCategory
  }

  setChallengeCategory(challengeCategory: ChallengeCategory) {
    this._challengeCategory = challengeCategory
  }

  get stageOfLife() {
    return this._stageOfLife
  }

  setStageOfLife(challengeCategory: ChallengeCategory) {
    this._challengeCategory = challengeCategory
  }
}
