import { TestBed } from '@angular/core/testing'

import { GenericApi } from './generic-api'

describe('GenericApi', () => {
  let service: GenericApi

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(GenericApi)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
