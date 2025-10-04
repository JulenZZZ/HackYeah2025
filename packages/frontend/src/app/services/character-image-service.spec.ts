import { TestBed } from '@angular/core/testing'

import { CharacterImageService } from './character-image-service'

describe('CharacterImageService', () => {
  let service: CharacterImageService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(CharacterImageService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
