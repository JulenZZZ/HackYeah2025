import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GameModeSelect } from './game-mode-select'

describe('GameModeSelect', () => {
  let component: GameModeSelect
  let fixture: ComponentFixture<GameModeSelect>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameModeSelect],
    }).compileComponents()

    fixture = TestBed.createComponent(GameModeSelect)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
