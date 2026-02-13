import "./RemindersFilter.css";

export type FilterStatus = "all" | "active" | "inactive";
export type SortOption = "date" | "title" | "created";

interface RemindersFilterProps {
  searchQuery: string;
  filterStatus: FilterStatus;
  sortBy: SortOption;
  onSearchChange: (query: string) => void;
  onFilterChange: (status: FilterStatus) => void;
  onSortChange: (sort: SortOption) => void;
  onClearFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export default function RemindersFilter({
  searchQuery,
  filterStatus,
  sortBy,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onClearFilters,
  totalCount,
  filteredCount,
}: RemindersFilterProps) {
  const hasActiveFilters =
    searchQuery !== "" || filterStatus !== "all" || sortBy !== "date";

  return (
    <div className="RemindersFilter">
      <div className="RemindersFilter__top">
        <div className="RemindersFilter__search">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search reminders..."
            className="RemindersFilter__search-input"
          />
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="RemindersFilter__clear-btn"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="RemindersFilter__controls">
        <div className="RemindersFilter__group">
          <label htmlFor="filter-status" className="RemindersFilter__label">
            Status:
          </label>
          <select
            id="filter-status"
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value as FilterStatus)}
            className="RemindersFilter__select"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="RemindersFilter__group">
          <label htmlFor="sort-by" className="RemindersFilter__label">
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="RemindersFilter__select"
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
            <option value="created">Created</option>
          </select>
        </div>

        <div className="RemindersFilter__count">
          Showing {filteredCount} of {totalCount} reminders
        </div>
      </div>
    </div>
  );
}
