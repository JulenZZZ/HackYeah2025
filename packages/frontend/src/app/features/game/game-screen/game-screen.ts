import { Component, inject } from '@angular/core'
import { CharacterImageService } from '../../../services/character-image-service'

@Component({
  selector: 'app-game-screen',
  imports: [],
  templateUrl: './game-screen.html',
  styleUrl: './game-screen.scss',
})
export class GameScreen {
  private _charImgSrvc = inject(CharacterImageService)

  public get charImg() {
    return this._charImgSrvc.getImagePathForCurrentCharacter()
  }

  public income = 6000

  public contract: 'UOP' | 'B2B' = 'UOP'

  public retirementMonthlySum = 2000
}
