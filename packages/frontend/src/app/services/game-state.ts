import { Injectable } from '@angular/core'
import { ChallengeCategory } from '../models/challenge-category.enum'
import { GameMode } from '../models/game-mode.enum'
import { Sex } from '../models/sex.enum'

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  // Prywatne zmienne z konwencyjnym prefixem '_'
  private _charSex: Sex | undefined
  private _gameMode: GameMode | undefined
  private _challengeCategory: ChallengeCategory | undefined

  /**
   * Getter dla płci postaci
   */
  get charSex(): Sex | undefined {
    return this._charSex
  }

  /**
   * Setter (metoda) dla płci postaci
   */
  setCharSex(sex: Sex) {
    this._charSex = sex
  }

  /**
   * Getter dla aktualnego trybu gry
   */
  get gameMode() {
    return this._gameMode
  }

  setGameMode(gameMode: GameMode) {
    this._gameMode = gameMode
  }

  /**
   * Getter dla kategorii wyzwania
   */
  get challengeCategory() {
    return this._challengeCategory
  }

  setChallengeCategory(challengeCategory: ChallengeCategory) {
    this._challengeCategory = challengeCategory
  }
}
