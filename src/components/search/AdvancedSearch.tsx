import "./AdvancedSearch.css";
import { useState, useEffect } from "react";
import { Search, X, Save, Clock } from "lucide-react";

export interface SearchFilters {
  query: string;
  dateFrom?: string;
  dateTo?: string;
  status: "all" | "active" | "inactive";
  hasLocation: boolean;
  isRecurring: boolean;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
}

const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  status: "all",
  hasLocation: false,
  isRecurring: false,
};

export default function AdvancedSearch({
  onSearch,
  initialFilters,
}: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  const [savedSearches, setSavedSearches] = useState<SearchFilters[]>(() => {
    const saved = localStorage.getItem("saved-searches");
    return saved ? JSON.parse(saved) : [];
  });

  // Debounce search on query change
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(filters);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, onSearch]);

  const handleSaveSearch = () => {
    const newSaved = [...savedSearches, filters].slice(-5); // Keep last 5
    setSavedSearches(newSaved);
    localStorage.setItem("saved-searches", JSON.stringify(newSaved));
  };

  const handleApplySearch = (saved: SearchFilters) => {
    setFilters(saved);
  };

  const handleRemoveSavedSearch = (index: number) => {
    const newSaved = savedSearches.filter((_, i) => i !== index);
    setSavedSearches(newSaved);
    localStorage.setItem("saved-searches", JSON.stringify(newSaved));
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const hasActiveFilters =
    filters.query ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.status !== "all" ||
    filters.hasLocation ||
    filters.isRecurring;

  return (
    <div className="AdvancedSearch">
      <div className="AdvancedSearch__basic">
        <div className="AdvancedSearch__input-wrapper">
          <Search size={18} className="AdvancedSearch__input-icon" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            placeholder="Search reminders..."
            className="AdvancedSearch__input"
          />
          {filters.query && (
            <button
              onClick={() => setFilters({ ...filters, query: "" })}
              className="AdvancedSearch__clear-btn btn btn--ghost btn--icon"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`btn btn--secondary ${isExpanded ? "AdvancedSearch__toggle--active" : ""}`}
        >
          {isExpanded ? "Simple" : "Advanced"}
        </button>
      </div>

      {isExpanded && (
        <div className="AdvancedSearch__filters">
          <div className="AdvancedSearch__row">
            <label className="AdvancedSearch__field">
              <span>Date from:</span>
              <input
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value || undefined })
                }
              />
            </label>
            <label className="AdvancedSearch__field">
              <span>Date to:</span>
              <input
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value || undefined })
                }
              />
            </label>
          </div>

          <div className="AdvancedSearch__row">
            <label className="AdvancedSearch__field">
              <span>Status:</span>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: e.target.value as SearchFilters["status"],
                  })
                }
              >
                <option value="all">All</option>
                <option value="active">Active only</option>
                <option value="inactive">Inactive only</option>
              </select>
            </label>
          </div>

          <div className="AdvancedSearch__row AdvancedSearch__row--checkboxes">
            <label className="AdvancedSearch__checkbox">
              <input
                type="checkbox"
                checked={filters.hasLocation}
                onChange={(e) =>
                  setFilters({ ...filters, hasLocation: e.target.checked })
                }
              />
              <span>Has location</span>
            </label>
            <label className="AdvancedSearch__checkbox">
              <input
                type="checkbox"
                checked={filters.isRecurring}
                onChange={(e) =>
                  setFilters({ ...filters, isRecurring: e.target.checked })
                }
              />
              <span>Recurring only</span>
            </label>
          </div>

          <div className="AdvancedSearch__actions">
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="btn btn--ghost">
                <X size={16} /> Clear filters
              </button>
            )}
            <button onClick={handleSaveSearch} className="btn btn--secondary">
              <Save size={16} /> Save search
            </button>
          </div>
        </div>
      )}

      {savedSearches.length > 0 && (
        <div className="AdvancedSearch__saved">
          <h4>
            <Clock size={14} /> Saved searches
          </h4>
          <div className="AdvancedSearch__saved-list">
            {savedSearches.map((saved, i) => (
              <div key={i} className="AdvancedSearch__saved-item">
                <button
                  onClick={() => handleApplySearch(saved)}
                  className="AdvancedSearch__saved-btn"
                >
                  {saved.query || "Advanced filter"}
                  {saved.status !== "all" && ` (${saved.status})`}
                </button>
                <button
                  onClick={() => handleRemoveSavedSearch(i)}
                  className="btn btn--ghost btn--icon AdvancedSearch__saved-remove"
                  aria-label="Remove saved search"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
