import { Component, Input, OnInit } from '@angular/core';
import { CardData } from 'src/app/models/interface';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-single-card',
  templateUrl: './single-card.component.html',
  styleUrls: ['./single-card.component.sass'],
})
export class SingleCardComponent implements OnInit {
  @Input() pokeData?: CardData;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {}

  selectCard() {
    if (!this.pokeData) return;
    this.commonService.activeCardId = this.pokeData.id;
    this.commonService.selectedCard$.next(this.pokeData);
  }

  isCardActive() {
    if (!this.pokeData) return;
    return this.commonService.activeCardId === this.pokeData.id;
  }
}
