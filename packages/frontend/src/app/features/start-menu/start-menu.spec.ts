import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StartMenu } from './start-menu'

describe('StartMenu', () => {
  let component: StartMenu
  let fixture: ComponentFixture<StartMenu>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartMenu],
    }).compileComponents()

    fixture = TestBed.createComponent(StartMenu)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
