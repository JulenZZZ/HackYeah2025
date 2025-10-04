import { Injectable } from '@angular/core'
import { GameStages } from '../../models/dto/game-rules.interface'
import { GenericApi } from './generic-api'

@Injectable({
  providedIn: 'root',
})
export class GameRulesApiService extends GenericApi {
  getGameRules() {
    return this._Get<GameStages>('game-rules')
  }
}
