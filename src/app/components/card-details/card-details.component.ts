import { Component, OnInit } from '@angular/core';
import { CardData } from 'src/app/models/interface';

import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.sass'],
})
export class CardDetailsComponent implements OnInit {
  selectedCard?: CardData;
  colors = ['red', 'orange', '#330066', 'blue', 'green', 'pink'];

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    // Retreive the clicked pokemon card details...
    this.commonService.selectedCard$.subscribe((item) => {
      this.selectedCard = item;

      this.commonService.fetchEvolutionData(item.id).subscribe((result) => {
        if (this.selectedCard && result.length > 0) {
          this.selectedCard.evolutions = result.map((i) => ({
            name: i.name,
            imageUrl: `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${i.id}.svg`,
          }));
        }
      });
    });
  }

  getCorrespondingStat(name: string) {
    let val: string;

    switch (name) {
      case 'hp':
        val = 'HP';
        break;
      case 'attack':
        val = 'ATK';
        break;
      case 'defense':
        val = 'DEF';
        break;
      case 'special-attack':
        val = 'SpaA';
        break;
      case 'special-defense':
        val = 'SpaD';
        break;
      case 'speed':
        val = 'SPD';
        break;
      default:
        val = 'NA';
    }

    return val;
  }
}
