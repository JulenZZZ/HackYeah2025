import { TestBed } from '@angular/core/testing'

import { GameRulesApiService } from './game-rules-api-service'

describe('GameRulesApiService', () => {
  let service: GameRulesApiService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(GameRulesApiService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
