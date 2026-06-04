import type { CategoryDefinition } from './types';

type CategoryKey =
  | 'weight'
  | 'length'
  | 'temperature'
  | 'volume'
  | 'area'
  | 'speed'
  | 'time'
  | 'pressure'
  | 'energy'
  | 'data_size'
  | 'angle';

export const converterCatalog: Record<CategoryKey, CategoryDefinition> = {
  weight: {
    label: 'Weight',
    units: {
      kg: { label: 'Kilogram', short: 'kg', toBase: (v) => v, fromBase: (v) => v },
      lb: { label: 'Pound', short: 'lb', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      g: { label: 'Gram', short: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      oz: { label: 'Ounce', short: 'oz', toBase: (v) => v * 0.028349523125, fromBase: (v) => v / 0.028349523125 },
      st: { label: 'Stone', short: 'st', toBase: (v) => v * 6.35029318, fromBase: (v) => v / 6.35029318 }
    },
    quickPairs: [['lb', 'kg'], ['kg', 'lb'], ['oz', 'g'], ['g', 'oz']]
  },
  length: {
    label: 'Length',
    units: {
      m: { label: 'Meter', short: 'm', toBase: (v) => v, fromBase: (v) => v },
      km: { label: 'Kilometer', short: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      cm: { label: 'Centimeter', short: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      in: { label: 'Inch', short: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      ft: { label: 'Foot', short: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      yd: { label: 'Yard', short: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      mi: { label: 'Mile', short: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 }
    },
    quickPairs: [['mi', 'km'], ['in', 'cm'], ['ft', 'm']]
  },
  temperature: {
    label: 'Temperature',
    units: {
      c: { label: 'Celsius', short: 'C', toBase: (v) => v, fromBase: (v) => v },
      f: { label: 'Fahrenheit', short: 'F', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      k: { label: 'Kelvin', short: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 }
    },
    quickPairs: [['f', 'c'], ['c', 'f'], ['k', 'c']]
  },
  volume: {
    label: 'Volume',
    units: {
      l: { label: 'Liter', short: 'L', toBase: (v) => v, fromBase: (v) => v },
      ml: { label: 'Milliliter', short: 'mL', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      gal: { label: 'US Gallon', short: 'gal', toBase: (v) => v * 3.785411784, fromBase: (v) => v / 3.785411784 },
      qt: { label: 'US Quart', short: 'qt', toBase: (v) => v * 0.946352946, fromBase: (v) => v / 0.946352946 },
      cup: { label: 'Cup', short: 'cup', toBase: (v) => v * 0.2365882365, fromBase: (v) => v / 0.2365882365 },
      tbsp: { label: 'Tablespoon', short: 'tbsp', toBase: (v) => v * 0.0147868, fromBase: (v) => v / 0.0147868 },
      tsp: { label: 'Teaspoon', short: 'tsp', toBase: (v) => v * 0.00492892, fromBase: (v) => v / 0.00492892 }
    },
    quickPairs: [['gal', 'l'], ['l', 'ml'], ['cup', 'ml'], ['tbsp', 'ml']]
  },
  area: {
    label: 'Area',
    units: {
      m2: { label: 'Square Meter', short: 'm2', toBase: (v) => v, fromBase: (v) => v },
      km2: { label: 'Square Kilometer', short: 'km2', toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
      ft2: { label: 'Square Foot', short: 'ft2', toBase: (v) => v * 0.09290304, fromBase: (v) => v / 0.09290304 },
      acre: { label: 'Acre', short: 'acre', toBase: (v) => v * 4046.8564224, fromBase: (v) => v / 4046.8564224 },
      ha: { label: 'Hectare', short: 'ha', toBase: (v) => v * 10_000, fromBase: (v) => v / 10_000 }
    },
    quickPairs: [['acre', 'ha'], ['ft2', 'm2'], ['ha', 'm2']]
  },
  speed: {
    label: 'Speed',
    units: {
      mps: { label: 'Meters / Second', short: 'm/s', toBase: (v) => v, fromBase: (v) => v },
      kph: { label: 'Kilometers / Hour', short: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      mph: { label: 'Miles / Hour', short: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      knot: { label: 'Knot', short: 'kt', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 }
    },
    quickPairs: [['mph', 'kph'], ['kph', 'mps'], ['knot', 'mph']]
  },
  time: {
    label: 'Time',
    units: {
      s: { label: 'Second', short: 's', toBase: (v) => v, fromBase: (v) => v },
      min: { label: 'Minute', short: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      hr: { label: 'Hour', short: 'hr', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      day: { label: 'Day', short: 'day', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      week: { label: 'Week', short: 'wk', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
      ms: { label: 'Millisecond', short: 'ms', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 }
    },
    quickPairs: [['hr', 'min'], ['day', 'hr'], ['min', 's']]
  },
  pressure: {
    label: 'Pressure',
    units: {
      pa: { label: 'Pascal', short: 'Pa', toBase: (v) => v, fromBase: (v) => v },
      kpa: { label: 'Kilopascal', short: 'kPa', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      bar: { label: 'Bar', short: 'bar', toBase: (v) => v * 100000, fromBase: (v) => v / 100000 },
      psi: { label: 'PSI', short: 'psi', toBase: (v) => v * 6894.757293168, fromBase: (v) => v / 6894.757293168 },
      atm: { label: 'Atmosphere', short: 'atm', toBase: (v) => v * 101325, fromBase: (v) => v / 101325 }
    },
    quickPairs: [['psi', 'bar'], ['atm', 'kpa'], ['bar', 'psi']]
  },
  energy: {
    label: 'Energy',
    units: {
      j: { label: 'Joule', short: 'J', toBase: (v) => v, fromBase: (v) => v },
      kj: { label: 'Kilojoule', short: 'kJ', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      cal: { label: 'Calorie', short: 'cal', toBase: (v) => v * 4.184, fromBase: (v) => v / 4.184 },
      kcal: { label: 'Kilocalorie', short: 'kcal', toBase: (v) => v * 4184, fromBase: (v) => v / 4184 },
      wh: { label: 'Watt-hour', short: 'Wh', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      kwh: { label: 'Kilowatt-hour', short: 'kWh', toBase: (v) => v * 3_600_000, fromBase: (v) => v / 3_600_000 }
    },
    quickPairs: [['kwh', 'kj'], ['kcal', 'kj'], ['wh', 'j']]
  },
  data_size: {
    label: 'Data Size',
    units: {
      b: { label: 'Byte', short: 'B', toBase: (v) => v, fromBase: (v) => v },
      kb: { label: 'Kilobyte', short: 'KB', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      mb: { label: 'Megabyte', short: 'MB', toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
      gb: { label: 'Gigabyte', short: 'GB', toBase: (v) => v * 1_000_000_000, fromBase: (v) => v / 1_000_000_000 },
      tb: { label: 'Terabyte', short: 'TB', toBase: (v) => v * 1_000_000_000_000, fromBase: (v) => v / 1_000_000_000_000 },
      kib: { label: 'Kibibyte', short: 'KiB', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      mib: { label: 'Mebibyte', short: 'MiB', toBase: (v) => v * 1_048_576, fromBase: (v) => v / 1_048_576 },
      gib: { label: 'Gibibyte', short: 'GiB', toBase: (v) => v * 1_073_741_824, fromBase: (v) => v / 1_073_741_824 }
    },
    quickPairs: [['gb', 'gib'], ['mb', 'mib'], ['kb', 'kib']]
  },
  angle: {
    label: 'Angle',
    units: {
      deg: { label: 'Degree', short: 'deg', toBase: (v) => v, fromBase: (v) => v },
      rad: { label: 'Radian', short: 'rad', toBase: (v) => (v * 180) / Math.PI, fromBase: (v) => (v * Math.PI) / 180 },
      grad: { label: 'Gradian', short: 'grad', toBase: (v) => v * 0.9, fromBase: (v) => v / 0.9 }
    },
    quickPairs: [['deg', 'rad'], ['rad', 'deg'], ['deg', 'grad']]
  }
};

export type { CategoryKey };

export const categoryEntries = Object.entries(converterCatalog) as Array<
  [CategoryKey, (typeof converterCatalog)[CategoryKey]]
>;
