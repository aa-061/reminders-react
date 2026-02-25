import "./RemindersFilter.css";
import { ArrowDown, ArrowUp } from "lucide-react";

export type FilterStatus = "all" | "active" | "inactive";
export type SortOption = "date" | "title" | "created";
export type SortDirection = "asc" | "desc";

interface RemindersFilterProps {
  searchQuery: string;
  filterStatus: FilterStatus;
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSearchChange: (query: string) => void;
  onFilterChange: (status: FilterStatus) => void;
  onSortChange: (sort: SortOption) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
  onClearFilters: () => void;
  totalCount: number;
  filteredCount: number;
  selectedCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function RemindersFilter({
  searchQuery,
  filterStatus,
  sortBy,
  sortDirection,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onSortDirectionChange,
  onClearFilters,
  totalCount,
  filteredCount,
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
  currentPage,
  totalPages,
  onPageChange,
}: RemindersFilterProps) {
  const hasActiveFilters =
    searchQuery !== "" ||
    filterStatus !== "all" ||
    sortBy !== "date" ||
    sortDirection !== "desc";

  const toggleSortDirection = () => {
    onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc");
  };

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
          <button
            onClick={toggleSortDirection}
            className="RemindersFilter__sort-direction btn btn--ghost btn--icon"
            title={sortDirection === "asc" ? "Ascending" : "Descending"}
            aria-label={`Sort ${sortDirection === "asc" ? "ascending" : "descending"}`}
          >
            {sortDirection === "asc" ? (
              <ArrowUp size={18} />
            ) : (
              <ArrowDown size={18} />
            )}
          </button>
        </div>

        <div className="RemindersFilter__count">
          Showing {filteredCount} of {totalCount} reminders
        </div>
      </div>

      {/* Selection actions bar */}
      <div className="RemindersFilter__selection">
        <div className="RemindersFilter__selection-actions">
          <button
            onClick={selectedCount > 0 ? onDeselectAll : onSelectAll}
            className="btn btn--ghost btn--sm"
          >
            {selectedCount > 0 ? "Deselect all" : "Select all"}
          </button>
          {selectedCount > 0 && (
            <>
              <span className="RemindersFilter__selection-count">
                {selectedCount} selected
              </span>
              <button
                onClick={onDeleteSelected}
                className="btn btn--danger btn--sm"
              >
                Delete selected
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="RemindersFilter__pagination">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn--ghost btn--sm"
          >
            Previous
          </button>
          <span className="RemindersFilter__pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn--ghost btn--sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
