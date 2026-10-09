import { useState, useEffect, useRef } from 'react';

const API_URL = 'http://m26452hl.beget.tech';

function AddressAutocomplete({ value, onChange, placeholder, disabled }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const debounceTimer = useRef(null);
  const lastQueryRef = useRef('');

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Клик вне — закрыть
  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const fetchSuggestions = async (q) => {
    if (q.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (q === lastQueryRef.current) return;
    lastQueryRef.current = q;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/geocode.php?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
      setOpen(true);
    } catch (e) {
      console.error('Ошибка геокодирования:', e);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setHighlightedIndex(-1);

    // Сброс последнего запроса, если пользователь что-то изменил
    lastQueryRef.current = '';

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchSuggestions(val), 600);
  };

  const handleSelect = (item) => {
    setQuery(item.full);
    onChange(item.full);
    setOpen(false);
    setSuggestions([]);
    setHighlightedIndex(-1);
    lastQueryRef.current = item.full;
  };

  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0) {
        e.preventDefault();
        handleSelect(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <textarea
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (query.length >= 3 && suggestions.length > 0) setOpen(true);
        }}
        placeholder={placeholder}
        disabled={disabled}
        rows="2"
        autoComplete="off"
      />

      {loading && (
        <span className="autocomplete-loading">🔍 Поиск адреса...</span>
      )}

      {open && suggestions.length > 0 && (
        <ul className="autocomplete-list">
          {suggestions.map((item, idx) => (
            <li
              key={`${item.lat}-${item.lon}-${idx}`}
              className={`autocomplete-item ${idx === highlightedIndex ? 'highlighted' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(item); }}
              onMouseEnter={() => setHighlightedIndex(idx)}
            >
              <span className="autocomplete-street">{item.full}</span>
              {item.state && (
                <span className="autocomplete-city">{item.state}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {open && !loading && suggestions.length === 0 && query.length >= 3 && (
        <ul className="autocomplete-list">
          <li className="autocomplete-empty">
            Ничего не найдено. Введите адрес вручную
          </li>
        </ul>
      )}
    </div>
  );
}

export default AddressAutocomplete;