// Interface of the single pokemon data that is coming from database...
export interface PokeData {
  id: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  weight: number;
  abilities: {
    ability: { name: string };
  }[];
  base_experience: number;
  height: number;
  order: number;
  stats: {
    base_stat: number;
    stat: { name: string };
  }[];
  name: string;
  url: string;
}

// Interface of the pokemon data that we are working on with to display contents...
export interface PokeCards {
  count: number;
  next: string;
  previous: string;
  results: CardData[];
}

export interface CardData {
  id: number;
  url: string;
  name: string;
  types: string[];
  imageUrl: string;
  weight: number;
  abilities: string[];
  base_exp: number;
  height: number;
  order: number;
  stats: {
    name: string;
    value: number;
  }[];
  evolutions?: { name: string; imageUrl: string }[];
}

// Interface for the evolution data that is coming from database(partial)...
export interface EvolutionData {
  chain: {
    evolves_to: { evolves_to: { species: { name: string; url: string } }[] }[];
  };
}
