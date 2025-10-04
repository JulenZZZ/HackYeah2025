import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GameModeChallenge } from './game-mode-challenge'

describe('GameModeChallenge', () => {
  let component: GameModeChallenge
  let fixture: ComponentFixture<GameModeChallenge>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameModeChallenge],
    }).compileComponents()

    fixture = TestBed.createComponent(GameModeChallenge)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
