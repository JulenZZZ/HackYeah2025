import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GameModeEducational } from './game-mode-educational'

describe('GameModeEducational', () => {
  let component: GameModeEducational
  let fixture: ComponentFixture<GameModeEducational>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameModeEducational],
    }).compileComponents()

    fixture = TestBed.createComponent(GameModeEducational)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
