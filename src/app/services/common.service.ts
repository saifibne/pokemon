import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, forkJoin, map, switchMap } from 'rxjs';

import {
  CardData,
  EvolutionData,
  PokeCards,
  PokeData,
} from '../models/interface';

@Injectable({ providedIn: 'root' })
export class CommonService {
  selectedCard$ = new Subject<CardData>();
  searchedItems$ = new Subject<{ data: CardData[] | []; text: string }>();
  activeCardId = 1; /* Will hold the currently cliked card */

  constructor(private http: HttpClient) {}

  // Fetch the list of pokemon data with paginations...
  fetchPokemonData(limit: number, url?: string) {
    const apiUrl =
      url ?? `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`;

    let responseData: PokeCards;

    // After fetching the overall data fetch individual data for each pokemon since some
    // of the data is required...
    return this.http.get<PokeCards>(apiUrl).pipe(
      switchMap((data) => {
        responseData = data;
        const pokeDataObs: Observable<PokeData>[] = [];
        for (const item of data.results) {
          pokeDataObs.push(this.http.get<PokeData>(item.url));
        }

        return forkJoin(pokeDataObs);
      }),
      map((response: PokeData[]) => {
        console.log(response);
        const updatedResults = responseData.results.map((item, index) => {
          return {
            ...item,
            id: response[index].id,
            types: response[index].types.map((i) => i.type.name),
            base_exp: response[index].base_experience,
            height: response[index].height,
            weight: response[index].weight,
            abilities: response[index].abilities.map((i) => i.ability.name),
            stats: response[index].stats.map((i) => ({
              name: i.stat.name,
              value: i.base_stat,
            })),
            order: response[index].order,
            imageUrl: `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${response[index].id}.svg`,
          };
        });
        return { ...responseData, results: updatedResults };
      })
    );
  }

  // Fetch the evolution items of a particular pokemon...
  fetchEvolutionData(id: number) {
    return this.http
      .get<EvolutionData>(`https://pokeapi.co/api/v2/evolution-chain/${id}/`)
      .pipe(
        map((item) => {
          const evolutionItems: { name: string; id: number }[] = [];

          item.chain.evolves_to.forEach((i) =>
            i.evolves_to.forEach((k) => {
              const idArr = k.species.url.trim().split('/');
              const id = idArr[idArr.length - 2];
              evolutionItems.push({ name: k.species.name, id: +id });
            })
          );

          return evolutionItems;
        })
      );
  }

  // Search through the database for the pokemon with given name...
  onSearchItem(name: string) {
    if (name.trim() === '') {
      this.searchedItems$.next({ data: [], text: '' });
      return;
    }

    this.http
      .get<PokeData>(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .subscribe(
        (result) => {
          const updatedData: CardData = {
            id: result.id,
            name: result.name,
            url: `https://pokeapi.co/api/v2/pokemon/${name}`,
            types: result.types.map((i) => i.type.name),
            imageUrl: `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${result.id}.svg`,
            weight: result.weight,
            abilities: result.abilities.map((i) => i.ability.name),
            base_exp: result.base_experience,
            height: result.height,
            order: result.order,
            stats: result.stats.map((i) => ({
              name: i.stat.name,
              value: i.base_stat,
            })),
          };

          this.searchedItems$.next({ data: [updatedData], text: name });
        },
        (error) => {
          this.searchedItems$.next({ data: [], text: name });
        }
      );
  }
}
