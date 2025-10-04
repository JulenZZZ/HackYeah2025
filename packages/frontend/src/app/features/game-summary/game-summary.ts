import { CurrencyPipe } from '@angular/common'
import { Component } from '@angular/core'

@Component({
  selector: 'app-game-summary',
  imports: [CurrencyPipe],
  templateUrl: './game-summary.html',
  styleUrl: './game-summary.scss',
})
export class GameSummary {
  healthPercentage = 75
  savingsPercentage = 40
  fulfillmentPercentage = 60
  knowledgePercentage = 80
  stressPercentage = 30
  communityPercentage = 55
  afterCostsPercentage = 70
  retirementSavingsPercentage = 20

  income = 6000
  contractType = 'UOP'
  retirementSavings = 2187.99

  familyImageSrc = 'assets/family.png'

  updateHealth(newHealth: number) {
    this.healthPercentage = newHealth
  }
}
