import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GameScreen } from './game-screen'

describe('GameScreen', () => {
  let component: GameScreen
  let fixture: ComponentFixture<GameScreen>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameScreen],
    }).compileComponents()

    fixture = TestBed.createComponent(GameScreen)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
