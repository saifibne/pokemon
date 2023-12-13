import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CardData } from 'src/app/models/interface';

import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-cards-container',
  templateUrl: './cards-container.component.html',
  styleUrls: ['./cards-container.component.sass'],
})
export class CardsContainerComponent implements OnInit {
  pokeCards!: CardData[];
  nextPageUrl?: string;
  prevPageUrl?: string;
  prevLoading = false;
  nextLoading = false;
  activeItemId = 1;

  @ViewChild('inputText') inputText!: ElementRef;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    // First fetch the initial list of items...
    this.fetchData();

    // If there are search items than the search data will replace the previous stored item lists...
    this.commonService.searchedItems$.subscribe((result) => {
      if (result.text === '') {
        this.fetchData();
        return;
      }
      if (result.data) {
        this.pokeCards = result.data;
      }
      console.log(this.pokeCards);
    });
  }

  fetchData(url?: string) {
    this.commonService.fetchPokemonData(12, url).subscribe((result) => {
      this.pokeCards = result.results;
      if (!this.nextPageUrl) {
        this.commonService.selectedCard$.next(result.results[0]);
      }
      this.nextPageUrl = result.next;
      this.prevPageUrl = result.previous;
      this.prevLoading = false;
      this.nextLoading = false;
    });
  }

  goToNextPage() {
    if (this.nextLoading) return;
    this.nextLoading = true;
    this.fetchData(this.nextPageUrl);
  }

  goToPrevPage() {
    if (!this.prevPageUrl || this.prevLoading) return;
    this.prevLoading = true;
    this.fetchData(this.prevPageUrl);
  }

  onSearch(value: string) {
    this.commonService.onSearchItem(value);
  }

  onEnter(event: Event) {
    const keyCode = (event as KeyboardEvent).code;
    console.log(keyCode);
    if (keyCode === 'Enter') {
      this.onSearch((this.inputText.nativeElement as HTMLInputElement).value);
    }
  }
}
