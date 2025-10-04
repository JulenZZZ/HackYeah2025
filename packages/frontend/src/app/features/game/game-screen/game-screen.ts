import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { NavigationState } from '../../../models/navigation.enum'
import { CharacterImageService } from '../../../services/character-image-service'

@Component({
  selector: 'app-game-screen',
  imports: [],
  templateUrl: './game-screen.html',
  styleUrl: './game-screen.scss',
})
export class GameScreen {
  private _charImgSrvc = inject(CharacterImageService)
  private _router = inject(Router)

  public get charImg() {
    return this._charImgSrvc.getImagePathForCurrentCharacter()
  }

  public income = 6000

  public contract: 'UOP' | 'B2B' = 'UOP'

  public retirementMonthlySum = 2000

  public goToSummary() {
    return this._router.navigate([NavigationState.GameSummary])
  }
}
