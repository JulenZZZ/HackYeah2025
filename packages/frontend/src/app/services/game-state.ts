import { Injectable } from '@angular/core'
import { Sex } from '../models/sex.enum'

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private _charSex: Sex | undefined

  get charSex() {
    return this._charSex
  }

  setCharSex(sex: Sex) {
    this._charSex = sex
  }
}
