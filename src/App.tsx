import { useEffect, useMemo, useState } from 'react';

type UnitDefinition = {
  label: string;
  short: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
};

type CategoryDefinition = {
  label: string;
  units: Record<string, UnitDefinition>;
  quickPairs: Array<[string, string]>;
};

type CategoryKey = 'weight' | 'length' | 'temperature' | 'volume' | 'area' | 'speed' | 'time';

type HistoryItem = {
  id: number;
  text: string;
};

type ThemeMode = 'light' | 'dark';

const converterCatalog: Record<CategoryKey, CategoryDefinition> = {
  weight: {
    label: 'Weight',
    units: {
      kg: { label: 'Kilogram', short: 'kg', toBase: (v) => v, fromBase: (v) => v },
      lb: { label: 'Pound', short: 'lb', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      g: { label: 'Gram', short: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      oz: { label: 'Ounce', short: 'oz', toBase: (v) => v * 0.028349523125, fromBase: (v) => v / 0.028349523125 },
      st: { label: 'Stone', short: 'st', toBase: (v) => v * 6.35029318, fromBase: (v) => v / 6.35029318 }
    },
    quickPairs: [
      ['lb', 'kg'],
      ['kg', 'lb'],
      ['oz', 'g']
    ]
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
    quickPairs: [
      ['mi', 'km'],
      ['in', 'cm'],
      ['ft', 'm']
    ]
  },
  temperature: {
    label: 'Temperature',
    units: {
      c: { label: 'Celsius', short: 'C', toBase: (v) => v, fromBase: (v) => v },
      f: { label: 'Fahrenheit', short: 'F', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      k: { label: 'Kelvin', short: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 }
    },
    quickPairs: [
      ['f', 'c'],
      ['c', 'f'],
      ['k', 'c']
    ]
  },
  volume: {
    label: 'Volume',
    units: {
      l: { label: 'Liter', short: 'L', toBase: (v) => v, fromBase: (v) => v },
      ml: { label: 'Milliliter', short: 'mL', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      gal: { label: 'US Gallon', short: 'gal', toBase: (v) => v * 3.785411784, fromBase: (v) => v / 3.785411784 },
      qt: { label: 'US Quart', short: 'qt', toBase: (v) => v * 0.946352946, fromBase: (v) => v / 0.946352946 },
      cup: { label: 'Cup', short: 'cup', toBase: (v) => v * 0.2365882365, fromBase: (v) => v / 0.2365882365 }
    },
    quickPairs: [
      ['gal', 'l'],
      ['l', 'ml'],
      ['cup', 'ml']
    ]
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
    quickPairs: [
      ['acre', 'ha'],
      ['ft2', 'm2'],
      ['ha', 'm2']
    ]
  },
  speed: {
    label: 'Speed',
    units: {
      mps: { label: 'Meters / Second', short: 'm/s', toBase: (v) => v, fromBase: (v) => v },
      kph: { label: 'Kilometers / Hour', short: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      mph: { label: 'Miles / Hour', short: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      knot: { label: 'Knot', short: 'kt', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 }
    },
    quickPairs: [
      ['mph', 'kph'],
      ['kph', 'mps'],
      ['knot', 'mph']
    ]
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
    quickPairs: [
      ['hr', 'min'],
      ['day', 'hr'],
      ['min', 's']
    ]
  }
};

const categoryEntries = Object.entries(converterCatalog) as Array<[CategoryKey, CategoryDefinition]>;

function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const storedTheme = window.localStorage.getItem('unit-lab-theme');
    return storedTheme === 'dark' ? 'dark' : 'light';
  });
  const [category, setCategory] = useState<CategoryKey>('weight');
  const [fromUnit, setFromUnit] = useState('lb');
  const [toUnit, setToUnit] = useState('kg');
  const [inputValue, setInputValue] = useState('1');
  const [decimalHoursValue, setDecimalHoursValue] = useState('2.75');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copyStatus, setCopyStatus] = useState('');

  const activeCategory = converterCatalog[category];
  const unitEntries = Object.entries(activeCategory.units);
  const parsedValue = Number(inputValue);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('unit-lab-theme', theme);
  }, [theme]);

  const result = useMemo(() => {
    if (!Number.isFinite(parsedValue)) {
      return NaN;
    }

    const fromDefinition = activeCategory.units[fromUnit];
    const toDefinition = activeCategory.units[toUnit];

    if (!fromDefinition || !toDefinition) {
      return NaN;
    }

    const base = fromDefinition.toBase(parsedValue);
    return toDefinition.fromBase(base);
  }, [activeCategory.units, fromUnit, parsedValue, toUnit]);

  const formatNumber = (value: number): string => {
    if (!Number.isFinite(value)) {
      return '-';
    }

    return value.toLocaleString(undefined, {
      maximumFractionDigits: 8
    });
  };

  const decimalToClockTime = (decimalHours: number): string => {
    if (!Number.isFinite(decimalHours)) {
      return '-';
    }

    const sign = decimalHours < 0 ? '-' : '';
    let totalSeconds = Math.round(Math.abs(decimalHours) * 3600);
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds -= days * 86400;

    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds -= hours * 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds - minutes * 60;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');

    if (days > 0) {
      return `${sign}${days}d ${hh}:${mm}:${ss}`;
    }

    return `${sign}${hh}:${mm}:${ss}`;
  };

  const parsedDecimalHours = Number(decimalHoursValue);
  const decimalClockResult = decimalToClockTime(parsedDecimalHours);

  const handleCategoryChange = (nextCategory: CategoryKey): void => {
    const nextConfig = converterCatalog[nextCategory];
    const [nextFrom, nextTo] = nextConfig.quickPairs[0];
    setCategory(nextCategory);
    setFromUnit(nextFrom);
    setToUnit(nextTo);
  };

  const handleSwap = (): void => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const addToHistory = (): void => {
    if (!Number.isFinite(parsedValue) || !Number.isFinite(result)) {
      return;
    }

    const fromLabel = activeCategory.units[fromUnit].short;
    const toLabel = activeCategory.units[toUnit].short;
    const text = `${formatNumber(parsedValue)} ${fromLabel} -> ${formatNumber(result)} ${toLabel}`;

    setHistory((prev) => [{ id: Date.now(), text }, ...prev].slice(0, 6));
  };

  const copyResult = async (): Promise<void> => {
    if (!Number.isFinite(result)) {
      return;
    }

    try {
      await navigator.clipboard.writeText(formatNumber(result));
      setCopyStatus('Copied');
      setTimeout(() => setCopyStatus(''), 1200);
    } catch {
      setCopyStatus('Copy blocked');
      setTimeout(() => setCopyStatus(''), 1200);
    }
  };

  const handleThemeToggle = (): void => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  return (
    <main className="page">
      <section className="shell">
        <aside className="menuPanel">
          <h1>Unit Lab</h1>
          <p>Dynamic converter with quick routes across unit families.</p>
          <nav className="menu">
            {categoryEntries.map(([key, item]) => (
              <button
                key={key}
                type="button"
                className={key === category ? 'menuButton active' : 'menuButton'}
                onClick={() => handleCategoryChange(key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="converterPanel">
          <header className="topBar">
            <div className="topHeader">
              <h2>{activeCategory.label} Converter</h2>
              <button type="button" className="themeToggle" onClick={handleThemeToggle}>
                {theme === 'light' ? 'Dark Theme' : 'Light Theme'}
              </button>
            </div>
            <div className="chips">
              {activeCategory.quickPairs.map(([from, to]) => (
                <button
                  key={`${from}-${to}`}
                  type="button"
                  className="chip"
                  onClick={() => {
                    setFromUnit(from);
                    setToUnit(to);
                  }}
                >
                  {activeCategory.units[from].short} {'->'} {activeCategory.units[to].short}
                </button>
              ))}
            </div>
          </header>

          <div className="fieldGrid">
            <label className="field">
              <span>Value</span>
              <input
                type="number"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Type value"
              />
            </label>

            <label className="field">
              <span>From</span>
              <select value={fromUnit} onChange={(event) => setFromUnit(event.target.value)}>
                {unitEntries.map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label} ({item.short})
                  </option>
                ))}
              </select>
            </label>

            <button type="button" className="swap" onClick={handleSwap}>
              Swap
            </button>

            <label className="field">
              <span>To</span>
              <select value={toUnit} onChange={(event) => setToUnit(event.target.value)}>
                {unitEntries.map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label} ({item.short})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <section className="resultCard">
            <div>
              <span>Converted value</span>
              <strong>{formatNumber(result)}</strong>
            </div>
            <div className="actions">
              <button type="button" onClick={addToHistory}>
                Save to history
              </button>
              <button type="button" onClick={copyResult}>
                Copy result
              </button>
              <small>{copyStatus}</small>
            </div>
          </section>

          <section className="historyPanel">
            <h3>Recent conversions</h3>
            {history.length === 0 ? (
              <p className="empty">No saved conversions yet.</p>
            ) : (
              <ul>
                {history.map((entry) => (
                  <li key={entry.id}>{entry.text}</li>
                ))}
              </ul>
            )}
          </section>

          {category === 'time' && (
            <section className="timePanel">
              <h3>Decimal To Time</h3>
              <p>Enter decimal hours and get a clock-style value.</p>
              <div className="timeRow">
                <label className="field">
                  <span>Decimal hours</span>
                  <input
                    type="number"
                    value={decimalHoursValue}
                    onChange={(event) => setDecimalHoursValue(event.target.value)}
                    placeholder="Example: 1.5"
                  />
                </label>
                <div className="clockResult">
                  <span>Clock format</span>
                  <strong>{decimalClockResult}</strong>
                </div>
              </div>
            </section>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
