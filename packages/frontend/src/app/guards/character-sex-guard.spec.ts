import { TestBed } from '@angular/core/testing'
import { CanActivateFn } from '@angular/router'

import { characterSexGuard } from './character-sex-guard'

describe('characterSexGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => characterSexGuard(...guardParameters))

  beforeEach(() => {
    TestBed.configureTestingModule({})
  })

  it('should be created', () => {
    expect(executeGuard).toBeTruthy()
  })
})
