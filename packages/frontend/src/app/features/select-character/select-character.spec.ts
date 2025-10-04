import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SelectCharacter } from './select-character'

describe('SelectCharacter', () => {
  let component: SelectCharacter
  let fixture: ComponentFixture<SelectCharacter>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectCharacter],
    }).compileComponents()

    fixture = TestBed.createComponent(SelectCharacter)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
