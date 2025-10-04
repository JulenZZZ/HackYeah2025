import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GameModeSandbox } from './game-mode-sandbox'

describe('GameModeSandbox', () => {
  let component: GameModeSandbox
  let fixture: ComponentFixture<GameModeSandbox>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameModeSandbox],
    }).compileComponents()

    fixture = TestBed.createComponent(GameModeSandbox)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
