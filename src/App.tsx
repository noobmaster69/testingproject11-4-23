import { useEffect, useMemo, useRef, useState } from 'react';
import {
  categoryEntries,
  clockToDecimalHours,
  converterCatalog,
  convertValue,
  decimalHoursToClock,
  formatNumber,
  parseNaturalQuery,
  type CategoryKey,
  type FavoritePair,
  type HistoryItem
} from './converters';

type ThemeMode = 'light' | 'dark' | 'auto';
type ThemePreset = 'ocean' | 'slate' | 'solarized';
type CopyMode = 'result' | 'full';
type PageKey = 'units' | 'time' | 'currency' | 'files';
type FileTypeKey = 'pdf' | 'doc' | 'docx' | 'txt' | 'md' | 'png' | 'jpg' | 'svg' | 'mp3' | 'wav';

type SavedProfile = {
  name: string;
  category: CategoryKey;
  from: string;
  to: string;
  value: string;
};

const pageOptions: Array<{ key: PageKey; label: string; description: string }> = [
  { key: 'units', label: 'Unit Converter', description: 'Weight, length, temperature, and more.' },
  { key: 'time', label: 'Time Converter', description: 'Time units plus decimal hours and clock time.' },
  { key: 'currency', label: 'Currency Converter', description: 'Live FX conversion from Frankfurter.' },
  { key: 'files', label: 'File Type Switcher', description: 'Change file extensions for common formats.' }
];

const fileTypeOptions: Array<{ key: FileTypeKey; label: string }> = [
  { key: 'pdf', label: 'PDF' },
  { key: 'doc', label: 'DOC' },
  { key: 'docx', label: 'DOCX' },
  { key: 'txt', label: 'TXT' },
  { key: 'md', label: 'Markdown' },
  { key: 'png', label: 'PNG' },
  { key: 'jpg', label: 'JPG' },
  { key: 'svg', label: 'SVG' },
  { key: 'mp3', label: 'MP3' },
  { key: 'wav', label: 'WAV' }
];

const filePresetPairs: Array<[FileTypeKey, FileTypeKey]> = [
  ['pdf', 'docx'],
  ['docx', 'pdf'],
  ['png', 'jpg'],
  ['jpg', 'png'],
  ['wav', 'mp3'],
  ['mp3', 'wav']
];

const HISTORY_KEY = 'unit-lab-history-v2';
const FAVORITES_KEY = 'unit-lab-favorites-v2';
const THEME_KEY = 'unit-lab-theme-v2';
const PRESET_KEY = 'unit-lab-preset-v2';
const PROFILES_KEY = 'unit-lab-profiles-v2';
const ONBOARDING_KEY = 'unit-lab-onboarding-dismissed-v2';

function App() {
  const initialPage = (() => {
    const queryPage = new URLSearchParams(window.location.search).get('page');
    return queryPage === 'units' || queryPage === 'time' || queryPage === 'currency' || queryPage === 'files' ? queryPage : 'units';
  })();

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const stored = window.localStorage.getItem(THEME_KEY);
    return stored === 'dark' || stored === 'light' || stored === 'auto' ? stored : 'auto';
  });
  const [themePreset, setThemePreset] = useState<ThemePreset>(() => {
    const stored = window.localStorage.getItem(PRESET_KEY);
    return stored === 'slate' || stored === 'solarized' || stored === 'ocean' ? stored : 'ocean';
  });

  const [activePage, setActivePage] = useState<PageKey>(initialPage);

  const [category, setCategory] = useState<CategoryKey>('weight');
  const [fromUnit, setFromUnit] = useState('lb');
  const [toUnit, setToUnit] = useState('kg');
  const [inputValue, setInputValue] = useState('1');
  const [precision, setPrecision] = useState(8);
  const [scientific, setScientific] = useState(false);
  const [copyMode, setCopyMode] = useState<CopyMode>('result');

  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter] = useState('');

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const stored = window.localStorage.getItem(HISTORY_KEY);
    try {
      return stored ? (JSON.parse(stored) as HistoryItem[]) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<FavoritePair[]>(() => {
    const stored = window.localStorage.getItem(FAVORITES_KEY);
    try {
      return stored ? (JSON.parse(stored) as FavoritePair[]) : [];
    } catch {
      return [];
    }
  });

  const [profiles, setProfiles] = useState<SavedProfile[]>(() => {
    const stored = window.localStorage.getItem(PROFILES_KEY);
    try {
      return stored ? (JSON.parse(stored) as SavedProfile[]) : [];
    } catch {
      return [];
    }
  });

  const [profileName, setProfileName] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [notice, setNotice] = useState('');

  const [decimalHoursValue, setDecimalHoursValue] = useState('2.75');
  const [clockValue, setClockValue] = useState('02:45:00');

  const [nlQuery, setNlQuery] = useState('');
  const [voiceStatus, setVoiceStatus] = useState('');

  const [showOnboarding, setShowOnboarding] = useState(() => window.localStorage.getItem(ONBOARDING_KEY) !== '1');

  const [currencyFrom, setCurrencyFrom] = useState('USD');
  const [currencyTo, setCurrencyTo] = useState('EUR');
  const [currencyAmount, setCurrencyAmount] = useState('100');
  const [currencyResult, setCurrencyResult] = useState('');
  const [currencyError, setCurrencyError] = useState('');
  const [currencyLoading, setCurrencyLoading] = useState(false);

  const [fileName, setFileName] = useState('report.pdf');
  const [fileFromType, setFileFromType] = useState<FileTypeKey>('pdf');
  const [fileToType, setFileToType] = useState<FileTypeKey>('docx');
  const [fileStatus, setFileStatus] = useState('');

  const valueInputRef = useRef<HTMLInputElement | null>(null);

  const activeCategory = converterCatalog[category];
  const activePageInfo = pageOptions.find((page) => page.key === activePage) ?? pageOptions[0];
  const parsedValue = Number(inputValue);

  const filteredFromUnits = useMemo(() => {
    const needle = fromFilter.trim().toLowerCase();
    return Object.entries(activeCategory.units).filter(([key, unit]) => {
      if (!needle) {
        return true;
      }
      return (
        key.includes(needle) ||
        unit.short.toLowerCase().includes(needle) ||
        unit.label.toLowerCase().includes(needle)
      );
    });
  }, [activeCategory.units, fromFilter]);

  const filteredToUnits = useMemo(() => {
    const needle = toFilter.trim().toLowerCase();
    return Object.entries(activeCategory.units).filter(([key, unit]) => {
      if (!needle) {
        return true;
      }
      return (
        key.includes(needle) ||
        unit.short.toLowerCase().includes(needle) ||
        unit.label.toLowerCase().includes(needle)
      );
    });
  }, [activeCategory.units, toFilter]);

  const result = useMemo(() => convertValue(activeCategory, fromUnit, toUnit, parsedValue), [
    activeCategory,
    fromUnit,
    toUnit,
    parsedValue
  ]);

  const formattedResult = formatNumber(result, precision, scientific);
  const fromLabel = activeCategory.units[fromUnit]?.short ?? fromUnit;
  const toLabel = activeCategory.units[toUnit]?.short ?? toUnit;
  const currentStatement = `${formatNumber(parsedValue, precision, scientific)} ${fromLabel} = ${formattedResult} ${toLabel}`;
  const activeUnitCount = Object.keys(activeCategory.units).length;
  const totalUnitCount = categoryEntries.reduce((total, [, item]) => total + Object.keys(item.units).length, 0);

  const shareUrl = useMemo(() => {
    const search = new URLSearchParams();
    search.set('page', activePage);
    search.set('category', category);
    search.set('from', fromUnit);
    search.set('to', toUnit);
    search.set('value', inputValue || '0');
    return `${window.location.origin}${window.location.pathname}?${search.toString()}`;
  }, [activePage, category, fromUnit, inputValue, toUnit]);

  const fileBaseName = useMemo(() => fileName.replace(/\.[^.]+$/, '') || 'file', [fileName]);
  const filePreviewName = `${fileBaseName}.${fileToType}`;
  const fileFormatHint =
    fileFromType === fileToType
      ? 'Pick a different output type to change the file extension.'
      : `Rename the extension from .${fileFromType} to .${fileToType}.`;

  const formulaPreview = useMemo(() => {
    const zero = convertValue(activeCategory, fromUnit, toUnit, 0);
    const one = convertValue(activeCategory, fromUnit, toUnit, 1);

    if (!Number.isFinite(zero) || !Number.isFinite(one)) {
      return 'Formula preview unavailable';
    }

    const slope = one - zero;
    const intercept = zero;
    return `${toLabel} = (${formatNumber(slope, 8, false)} * ${fromLabel}) + ${formatNumber(intercept, 8, false)}`;
  }, [activeCategory, fromLabel, fromUnit, toLabel, toUnit]);

  const isFavorite = favorites.some((item) => item.category === category && item.from === fromUnit && item.to === toUnit);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const qPage = query.get('page');
    const qCategory = query.get('category');
    const qFrom = query.get('from');
    const qTo = query.get('to');
    const qValue = query.get('value');

    if (qPage === 'units' || qPage === 'time' || qPage === 'currency' || qPage === 'files') {
      setActivePage(qPage);
      if (qPage === 'time') {
        setCategory('time');
      }
    }

    if (qCategory && qCategory in converterCatalog) {
      const nextCategory = qCategory as CategoryKey;
      setCategory(nextCategory);
      if (qFrom && converterCatalog[nextCategory].units[qFrom]) {
        setFromUnit(qFrom);
      }
      if (qTo && converterCatalog[nextCategory].units[qTo]) {
        setToUnit(qTo);
      }
      if (qValue) {
        setInputValue(qValue);
      }
    }

    const qFileName = query.get('fileName');
    const qFileFrom = query.get('fileFrom');
    const qFileTo = query.get('fileTo');
    if (qFileName) {
      setFileName(qFileName);
    }
    if (qFileFrom && fileTypeOptions.some((item) => item.key === qFileFrom)) {
      setFileFromType(qFileFrom as FileTypeKey);
    }
    if (qFileTo && fileTypeOptions.some((item) => item.key === qFileTo)) {
      setFileToType(qFileTo as FileTypeKey);
    }
  }, []);

  useEffect(() => {
    const search = new URLSearchParams();
    search.set('page', activePage);

    if (activePage === 'units' || activePage === 'time') {
      search.set('category', category);
      search.set('from', fromUnit);
      search.set('to', toUnit);
      search.set('value', inputValue || '0');
    }

    if (activePage === 'currency') {
      search.set('currencyFrom', currencyFrom);
      search.set('currencyTo', currencyTo);
      search.set('currencyAmount', currencyAmount || '0');
    }

    if (activePage === 'files') {
      search.set('fileName', fileName);
      search.set('fileFrom', fileFromType);
      search.set('fileTo', fileToType);
    }

    const url = `${window.location.pathname}?${search.toString()}`;
    window.history.replaceState({}, '', url);
  }, [activePage, category, currencyAmount, currencyFrom, currencyTo, fileFromType, fileName, fileToType, fromUnit, inputValue, toUnit]);

  useEffect(() => {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolvedTheme = themeMode === 'auto' ? (systemDark ? 'dark' : 'light') : themeMode;
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    document.documentElement.setAttribute('data-preset', themePreset);

    window.localStorage.setItem(THEME_KEY, themeMode);
    window.localStorage.setItem(PRESET_KEY, themePreset);
  }, [themeMode, themePreset]);

  useEffect(() => {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    window.localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT');

      if (event.key === '/' && !typing) {
        event.preventDefault();
        valueInputRef.current?.focus();
      }

      if (event.key.toLowerCase() === 's' && !typing) {
        event.preventDefault();
        handleSwap();
      }

      if (event.key === 'Enter' && !typing) {
        addToHistory();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  useEffect(() => {
    const amount = Number(currencyAmount);
    if (!Number.isFinite(amount)) {
      setCurrencyResult('-');
      return;
    }

    let cancelled = false;
    const run = async (): Promise<void> => {
      setCurrencyLoading(true);
      setCurrencyError('');
      try {
        const response = await fetch(
          `https://api.frankfurter.app/latest?from=${encodeURIComponent(currencyFrom)}&to=${encodeURIComponent(currencyTo)}`
        );
        if (!response.ok) {
          throw new Error('Request failed');
        }
        const data = (await response.json()) as { rates: Record<string, number> };
        const rate = data.rates[currencyTo];
        if (!rate || cancelled) {
          return;
        }
        setCurrencyResult(formatNumber(amount * rate, 6, false));
      } catch {
        if (!cancelled) {
          setCurrencyError('Currency API unavailable right now');
          setCurrencyResult('-');
        }
      } finally {
        if (!cancelled) {
          setCurrencyLoading(false);
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [currencyAmount, currencyFrom, currencyTo]);

  const handleCategoryChange = (nextCategory: CategoryKey): void => {
    const next = converterCatalog[nextCategory];
    const [from, to] = next.quickPairs[0];
    setCategory(nextCategory);
    setFromUnit(from);
    setToUnit(to);
    setFromFilter('');
    setToFilter('');
  };

  const handleSwap = (): void => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleFromSelect = (nextFrom: string): void => {
    setFromUnit(nextFrom);
    if (nextFrom === toUnit) {
      setToUnit(fromUnit);
      setNotice('Auto-swapped to avoid identical units');
      setTimeout(() => setNotice(''), 1600);
    }
  };

  const handleToSelect = (nextTo: string): void => {
    setToUnit(nextTo);
    if (nextTo === fromUnit) {
      setFromUnit(toUnit);
      setNotice('Auto-swapped to avoid identical units');
      setTimeout(() => setNotice(''), 1600);
    }
  };

  const addToHistory = (): void => {
    if (!Number.isFinite(parsedValue) || !Number.isFinite(result)) {
      return;
    }
    setHistory((prev) => [{ id: Date.now(), text: currentStatement }, ...prev].slice(0, 10));
  };

  const clearForm = (): void => {
    setInputValue('');
    setCopyStatus('');
  };

  const resetCategoryDefaults = (): void => {
    const [from, to] = activeCategory.quickPairs[0];
    setFromUnit(from);
    setToUnit(to);
    setInputValue('1');
    setFromFilter('');
    setToFilter('');
  };

  const toggleFavorite = (): void => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.category === category && item.from === fromUnit && item.to === toUnit);
      if (exists) {
        return prev.filter((item) => !(item.category === category && item.from === fromUnit && item.to === toUnit));
      }
      return [{ category, from: fromUnit, to: toUnit }, ...prev].slice(0, 16);
    });
  };

  const copyResult = async (): Promise<void> => {
    if (!Number.isFinite(result)) {
      return;
    }

    const payload = copyMode === 'result' ? formattedResult : currentStatement;

    try {
      await navigator.clipboard.writeText(payload);
      setCopyStatus('Copied');
      setTimeout(() => setCopyStatus(''), 1200);
    } catch {
      setCopyStatus('Copy blocked');
      setTimeout(() => setCopyStatus(''), 1200);
    }
  };

  const copyShareLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus('Share link copied');
      setTimeout(() => setShareStatus(''), 1400);
    } catch {
      setShareStatus('Copy blocked');
      setTimeout(() => setShareStatus(''), 1400);
    }
  };

  const decimalClockResult = decimalHoursToClock(Number(decimalHoursValue));
  const clockToDecimal = clockToDecimalHours(clockValue);

  const applyNaturalQuery = (): void => {
    const parsed = parseNaturalQuery(nlQuery);
    if (!parsed) {
      setNotice('Could not parse command. Try: 15 lb to kg');
      setTimeout(() => setNotice(''), 1600);
      return;
    }

    const targetCategory = categoryEntries.find(([, entry]) => entry.units[parsed.from] && entry.units[parsed.to]);
    if (!targetCategory) {
      setNotice('Units not found in same category');
      setTimeout(() => setNotice(''), 1600);
      return;
    }

    setCategory(targetCategory[0]);
    setFromUnit(parsed.from);
    setToUnit(parsed.to);
    setInputValue(String(parsed.value));
  };

  const startVoiceInput = (): void => {
    const voiceWindow = window as unknown as {
      SpeechRecognition?: new () => any;
      webkitSpeechRecognition?: new () => any;
    };

    const SpeechRecognitionCtor = voiceWindow.SpeechRecognition ?? voiceWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setVoiceStatus('Voice recognition unavailable in this browser');
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setNlQuery(transcript);
      setVoiceStatus('Voice captured');
    };
    recognition.onerror = () => setVoiceStatus('Voice capture failed');
    recognition.start();
  };

  const saveProfile = (): void => {
    const name = profileName.trim();
    if (!name) {
      return;
    }

    setProfiles((prev) => {
      const filtered = prev.filter((item) => item.name !== name);
      return [{ name, category, from: fromUnit, to: toUnit, value: inputValue }, ...filtered].slice(0, 10);
    });
    setProfileName('');
  };

  const loadProfile = (profile: SavedProfile): void => {
    setCategory(profile.category);
    setFromUnit(profile.from);
    setToUnit(profile.to);
    setInputValue(profile.value);
    setActivePage('units');
  };

  const handlePageChange = (nextPage: PageKey): void => {
    setActivePage(nextPage);
    if (nextPage === 'time') {
      setCategory('time');
    }
  };

  const handleFileRename = (): void => {
    setFileName(filePreviewName);
    setFileStatus('Updated extension');
    setTimeout(() => setFileStatus(''), 1200);
  };

  const swapFileTypes = (): void => {
    setFileFromType(fileToType);
    setFileToType(fileFromType);
    setFileStatus('Swapped file types');
    setTimeout(() => setFileStatus(''), 1200);
  };

  const favoritePairsForCategory = favorites.filter((item) => item.category === category);

  return (
    <main className="page">
      {showOnboarding && (
        <section className="onboarding">
          <strong>Tip:</strong> Press <kbd>/</kbd> to focus input, <kbd>S</kbd> to swap, and <kbd>Enter</kbd> to save to history.
          <button
            type="button"
            onClick={() => {
              setShowOnboarding(false);
              window.localStorage.setItem(ONBOARDING_KEY, '1');
            }}
          >
            Dismiss
          </button>
        </section>
      )}

      <section className="heroPanel">
        <div>
          <p className="eyebrow">Unit Lab app</p>
          <h1>Convert, save, and share measurements in seconds.</h1>
          <p>
            A focused conversion workspace for quick everyday math, reusable profiles, favorite unit pairs, and
            installable offline access.
          </p>
        </div>
        <div className="workspaceCard" aria-label="Current workspace">
          <span>Current workspace</span>
          <strong>{activeCategory.label}</strong>
          <p>{currentStatement}</p>
          <button type="button" onClick={copyShareLink}>
            Copy share link
          </button>
          <small>{shareStatus || `${categoryEntries.length} categories and ${totalUnitCount} units ready`}</small>
        </div>
      </section>

      <section className="shell">
        <aside className="menuPanel">
          <h1>Unit Lab</h1>
          <p>Advanced converter workspace.</p>

          <label className="menuSelect">
            Conversion page
            <select value={activePage} onChange={(event) => handlePageChange(event.target.value as PageKey)}>
              {pageOptions.map((page) => (
                <option key={page.key} value={page.key}>
                  {page.label}
                </option>
              ))}
            </select>
          </label>

          <div className="themeControls">
            <label>
              Theme
              <select value={themeMode} onChange={(event) => setThemeMode(event.target.value as ThemeMode)}>
                <option value="auto">Auto</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label>
              Preset
              <select value={themePreset} onChange={(event) => setThemePreset(event.target.value as ThemePreset)}>
                <option value="ocean">Ocean</option>
                <option value="slate">Slate</option>
                <option value="solarized">Solarized</option>
              </select>
            </label>
          </div>

          {activePage === 'units' && (
            <label className="menuSelect">
              Unit category
              <select value={category} onChange={(event) => handleCategoryChange(event.target.value as CategoryKey)}>
                {categoryEntries.map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {activePage !== 'units' && (
            <div className="pageDescription">
              <strong>{activePageInfo.label}</strong>
              <p>{activePageInfo.description}</p>
            </div>
          )}

          <a className="feedbackLink" href="https://github.com/noobmaster69/testingproject11-4-23/issues" target="_blank" rel="noreferrer">
            Send feedback
          </a>
        </aside>

        <section className="converterPanel">
          {activePage === 'units' && (
            <>
              <header className="topBar">
                <h2>{activeCategory.label} Converter</h2>
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
                {favoritePairsForCategory.length > 0 && (
                  <div className="chips">
                    {favoritePairsForCategory.map((pair) => (
                      <button
                        key={`${pair.category}-${pair.from}-${pair.to}`}
                        type="button"
                        className="chip fav"
                        onClick={() => {
                          setFromUnit(pair.from);
                          setToUnit(pair.to);
                        }}
                      >
                        Starred: {activeCategory.units[pair.from]?.short} {'->'} {activeCategory.units[pair.to]?.short}
                      </button>
                    ))}
                  </div>
                )}
              </header>

              <div className="fieldGrid">
                <label className="field">
                  <span>Value</span>
                  <input
                    ref={valueInputRef}
                    type="number"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="Type value"
                  />
                </label>

                <label className="field">
                  <span>Find from unit</span>
                  <input value={fromFilter} onChange={(event) => setFromFilter(event.target.value)} placeholder="Search..." />
                </label>

                <label className="field">
                  <span>From</span>
                  <select value={fromUnit} onChange={(event) => handleFromSelect(event.target.value)}>
                    {filteredFromUnits.map(([key, item]) => (
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
                  <span>Find to unit</span>
                  <input value={toFilter} onChange={(event) => setToFilter(event.target.value)} placeholder="Search..." />
                </label>

                <label className="field">
                  <span>To</span>
                  <select value={toUnit} onChange={(event) => handleToSelect(event.target.value)}>
                    {filteredToUnits.map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label} ({item.short})
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="controlsRow">
                <label>
                  Precision
                  <input
                    type="number"
                    min={0}
                    max={12}
                    value={precision}
                    onChange={(event) => setPrecision(Number(event.target.value))}
                  />
                </label>
                <label className="checkbox">
                  <input type="checkbox" checked={scientific} onChange={(event) => setScientific(event.target.checked)} />
                  Scientific notation
                </label>
                <label>
                  Copy format
                  <select value={copyMode} onChange={(event) => setCopyMode(event.target.value as CopyMode)}>
                    <option value="result">Result only</option>
                    <option value="full">Full statement</option>
                  </select>
                </label>
              </div>

              <section className="resultCard">
                <div>
                  <span>Converted value</span>
                  <strong>{formattedResult}</strong>
                  <p className="formula">{formulaPreview}</p>
                </div>
                <div className="actions">
                  <button type="button" onClick={addToHistory}>Save</button>
                  <button type="button" onClick={copyResult}>Copy</button>
                  <button type="button" onClick={toggleFavorite}>{isFavorite ? 'Unstar' : 'Star'}</button>
                  <button type="button" onClick={clearForm}>Clear</button>
                  <button type="button" onClick={resetCategoryDefaults}>Reset</button>
                  <small>{copyStatus || notice}</small>
                </div>
              </section>

              <section className="insightsGrid" aria-label="Workspace dashboard">
                <article>
                  <span>Active catalog</span>
                  <strong>{activeUnitCount}</strong>
                  <p>units in {activeCategory.label.toLowerCase()}</p>
                </article>
                <article>
                  <span>Saved work</span>
                  <strong>{history.length}</strong>
                  <p>recent conversions</p>
                </article>
                <article>
                  <span>Favorites</span>
                  <strong>{favoritePairsForCategory.length}</strong>
                  <p>starred pairs here</p>
                </article>
                <article>
                  <span>Profiles</span>
                  <strong>{profiles.length}</strong>
                  <p>reusable setups</p>
                </article>
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

              <section className="profilePanel">
                <h3>Profiles</h3>
                <div className="inline">
                  <input value={profileName} onChange={(event) => setProfileName(event.target.value)} placeholder="Profile name" />
                  <button type="button" onClick={saveProfile}>Save profile</button>
                </div>
                <div className="chips">
                  {profiles.map((profile) => (
                    <button key={profile.name} type="button" className="chip" onClick={() => loadProfile(profile)}>
                      {profile.name}
                    </button>
                  ))}
                </div>
              </section>

              <section className="nlPanel">
                <h3>Natural Language + Voice</h3>
                <div className="inline">
                  <input
                    value={nlQuery}
                    onChange={(event) => setNlQuery(event.target.value)}
                    placeholder="Example: 15 lb to kg"
                  />
                  <button type="button" onClick={applyNaturalQuery}>Apply</button>
                  <button type="button" onClick={startVoiceInput}>Voice</button>
                </div>
                <p className="empty">{voiceStatus}</p>
              </section>
            </>
          )}

          {activePage === 'time' && (
            <>
              <header className="topBar">
                <h2>Time Converter</h2>
                <p className="pageDescription">Convert time units and switch between decimal hours and clock format.</p>
              </header>

              <div className="fieldGrid compactGrid">
                <label className="field">
                  <span>Value</span>
                  <input
                    ref={valueInputRef}
                    type="number"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="Type value"
                  />
                </label>
                <label className="field">
                  <span>From</span>
                  <select value={fromUnit} onChange={(event) => handleFromSelect(event.target.value)}>
                    {filteredFromUnits.map(([key, item]) => (
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
                  <select value={toUnit} onChange={(event) => handleToSelect(event.target.value)}>
                    {filteredToUnits.map(([key, item]) => (
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
                  <strong>{formattedResult}</strong>
                  <p className="formula">{formulaPreview}</p>
                </div>
                <div className="actions">
                  <button type="button" onClick={addToHistory}>Save</button>
                  <button type="button" onClick={copyResult}>Copy</button>
                  <button type="button" onClick={clearForm}>Clear</button>
                  <button type="button" onClick={resetCategoryDefaults}>Reset</button>
                  <small>{copyStatus || notice}</small>
                </div>
              </section>

              <section className="timePanel">
                <h3>Decimal {'<->'} Time</h3>
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

                <div className="timeRow">
                  <label className="field">
                    <span>Clock time (HH:MM[:SS] or 1d HH:MM:SS)</span>
                    <input value={clockValue} onChange={(event) => setClockValue(event.target.value)} placeholder="02:30:00" />
                  </label>
                  <div className="clockResult">
                    <span>Decimal hours</span>
                    <strong>{Number.isFinite(clockToDecimal) ? formatNumber(clockToDecimal, 8, false) : '-'}</strong>
                  </div>
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
            </>
          )}

          {activePage === 'currency' && (
            <>
              <header className="topBar">
                <h2>Currency Converter</h2>
                <p className="pageDescription">Live exchange rates from Frankfurter.</p>
              </header>

              <section className="currencyPanel activePageCard">
                <h3>Currency (Live API)</h3>
                <div className="inline">
                  <input value={currencyAmount} onChange={(event) => setCurrencyAmount(event.target.value)} type="number" />
                  <input value={currencyFrom} onChange={(event) => setCurrencyFrom(event.target.value.toUpperCase())} maxLength={3} />
                  <span>{'->'}</span>
                  <input value={currencyTo} onChange={(event) => setCurrencyTo(event.target.value.toUpperCase())} maxLength={3} />
                  <strong>{currencyLoading ? 'Loading...' : currencyResult || '-'}</strong>
                </div>
                {currencyError && <p className="empty">{currencyError}</p>}
              </section>
            </>
          )}

          {activePage === 'files' && (
            <>
              <header className="topBar">
                <h2>File Type Switcher</h2>
                <p className="pageDescription">Choose a source type and a new target type, then update the extension.</p>
              </header>

              <section className="filePanel activePageCard">
                <div className="fieldGrid compactGrid fileGrid">
                  <label className="field">
                    <span>File name</span>
                    <input value={fileName} onChange={(event) => setFileName(event.target.value)} placeholder="report.pdf" />
                  </label>
                  <label className="field">
                    <span>From type</span>
                    <select value={fileFromType} onChange={(event) => setFileFromType(event.target.value as FileTypeKey)}>
                      {fileTypeOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="button" className="swap" onClick={swapFileTypes}>
                    Swap
                  </button>
                  <label className="field">
                    <span>To type</span>
                    <select value={fileToType} onChange={(event) => setFileToType(event.target.value as FileTypeKey)}>
                      {fileTypeOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="resultCard fileResultCard">
                  <div>
                    <span>Preview</span>
                    <strong>{filePreviewName}</strong>
                    <p className="formula">{fileFormatHint}</p>
                  </div>
                  <div className="actions">
                    <button type="button" onClick={handleFileRename}>Update filetype</button>
                    <small>{fileStatus}</small>
                  </div>
                </div>

                <p className="empty fileNote">
                  This updates the filename extension in the browser. Real PDF-to-DOC conversion would need a backend or external service.
                </p>

                <div className="chips">
                  {filePresetPairs.map(([from, to]) => (
                    <button
                      key={`${from}-${to}`}
                      type="button"
                      className="chip"
                      onClick={() => {
                        setFileFromType(from as FileTypeKey);
                        setFileToType(to as FileTypeKey);
                      }}
                    >
                      {from.toUpperCase()} {'->'} {to.toUpperCase()}
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          <a className="feedbackLink" href="./CHANGELOG.md" target="_blank" rel="noreferrer">
            View changelog
          </a>
        </section>
      </section>
    </main>
  );
}

export default App;

