export type UnitDefinition = {
  label: string;
  short: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
};

export type CategoryDefinition = {
  label: string;
  units: Record<string, UnitDefinition>;
  quickPairs: Array<[string, string]>;
};

export type ConverterCatalog = Record<string, CategoryDefinition>;

export type FavoritePair = {
  category: string;
  from: string;
  to: string;
};

export type HistoryItem = {
  id: number;
  text: string;
};
