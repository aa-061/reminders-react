import "./RemindersList.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useRef, type TouchEvent } from "react";
import { RefreshCw } from "lucide-react";
import type { IReminder } from "@/types";
import ReminderCard from "./ReminderCard";
import RemindersFilter, {
  type FilterStatus,
  type SortOption,
  type SortDirection,
} from "./RemindersFilter";

const ITEMS_PER_PAGE = 10;

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

if (!SERVER_URL) {
  throw new Error(
    "No server URL has been provided. Make sure to set VITE_SERVER_URL env var.",
  );
}

async function fetchReminders(): Promise<IReminder[]> {
  const response = await fetch(`${SERVER_URL}/reminders/all`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch reminders: ${response.statusText}`);
  }

  return response.json();
}

async function deleteReminder(id: number): Promise<void> {
  const response = await fetch(`${SERVER_URL}/reminders/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete reminder");
  }
}

async function updateReminder(
  id: number,
  data: Partial<IReminder>,
): Promise<IReminder> {
  const response = await fetch(`${SERVER_URL}/reminders/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update reminder");
  }

  return response.json();
}

export default function RemindersList() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // Pull-to-refresh state
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const REFRESH_THRESHOLD = 80;

  const handlePullTouchStart = (e: TouchEvent) => {
    if (listRef.current?.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handlePullTouchMove = (e: TouchEvent) => {
    if (!isPulling) return;
    const diff = e.touches[0].clientY - touchStartY.current;
    if (diff > 0 && diff < 120) {
      setPullDistance(diff);
    }
  };

  const handlePullTouchEnd = async () => {
    if (pullDistance > REFRESH_THRESHOLD) {
      setIsRefreshing(true);
      await queryClient.invalidateQueries({ queryKey: ["reminders"] });
      setIsRefreshing(false);
    }
    setPullDistance(0);
    setIsPulling(false);
  };

  const {
    data: reminders,
    isPending,
    error,
  } = useQuery({
    queryKey: ["reminders"],
    queryFn: fetchReminders,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
    onError: (error: Error) => {
      alert(`Failed to delete reminder: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IReminder> }) =>
      updateReminder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
    onError: (error: Error) => {
      alert(`Failed to update reminder: ${error.message}`);
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleToggleActive = (id: number, isActive: boolean) => {
    updateMutation.mutate({
      id,
      data: { is_active: isActive },
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setSortBy("date");
    setSortDirection("desc");
    setCurrentPage(1);
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (paginatedReminders.length > 0) {
      setSelectedIds(new Set(paginatedReminders.map((r) => r.id)));
    }
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.size} reminder${selectedIds.size > 1 ? "s" : ""}?`
    );

    if (!confirmed) return;

    for (const id of selectedIds) {
      await deleteMutation.mutateAsync(id);
    }
    setSelectedIds(new Set());
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedIds(new Set());
  };

  const filteredAndSortedReminders = useMemo(() => {
    if (!reminders) return [];

    let filtered = [...reminders];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (reminder) =>
          reminder.title.toLowerCase().includes(query) ||
          reminder.description.toLowerCase().includes(query) ||
          reminder.location?.toLowerCase().includes(query),
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((reminder) => {
        if (filterStatus === "active") return reminder.is_active !== false;
        if (filterStatus === "inactive") return reminder.is_active === false;
        return true;
      });
    }

    const now = new Date();

    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        // If sorting descending (default), put upcoming reminders first
        if (sortDirection === "desc") {
          const aIsFuture = dateA >= now;
          const bIsFuture = dateB >= now;

          // Future reminders come before past reminders
          if (aIsFuture && !bIsFuture) return -1;
          if (!aIsFuture && bIsFuture) return 1;

          // Within the same group, sort by date
          if (aIsFuture && bIsFuture) {
            // For future reminders, closest first
            comparison = dateA.getTime() - dateB.getTime();
          } else {
            // For past reminders, most recent first
            comparison = dateB.getTime() - dateA.getTime();
          }
        } else {
          comparison = dateA.getTime() - dateB.getTime();
        }
      } else if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
        if (sortDirection === "desc") comparison = -comparison;
      } else if (sortBy === "created") {
        comparison = a.id - b.id;
        if (sortDirection === "desc") comparison = -comparison;
      }

      return comparison;
    });

    return filtered;
  }, [reminders, searchQuery, filterStatus, sortBy, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedReminders.length / ITEMS_PER_PAGE);
  const paginatedReminders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedReminders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedReminders, currentPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  if (isPending) {
    return (
      <div className="RemindersList">
        <div className="RemindersList__loading">Loading reminders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="RemindersList">
        <div className="RemindersList__error">
          <p>Failed to load reminders</p>
          <p className="RemindersList__error-message">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  const hasReminders = reminders && reminders.length > 0;
  const hasFilteredResults = filteredAndSortedReminders.length > 0;

  return (
    <div
      className="RemindersList"
      ref={listRef}
      onTouchStart={handlePullTouchStart}
      onTouchMove={handlePullTouchMove}
      onTouchEnd={handlePullTouchEnd}
    >
      {/* Pull-to-refresh indicator */}
      <div
        className={`RemindersList__pull-indicator ${pullDistance > 0 || isRefreshing ? "RemindersList__pull-indicator--active" : ""}`}
        style={{ height: pullDistance > 0 ? `${pullDistance}px` : undefined }}
      >
        <RefreshCw
          size={20}
          className={isRefreshing ? "spinner" : ""}
          style={{ transform: `rotate(${pullDistance * 2}deg)` }}
        />
        <span>
          {isRefreshing
            ? "Refreshing..."
            : pullDistance > REFRESH_THRESHOLD
              ? "Release to refresh"
              : "Pull to refresh"}
        </span>
      </div>

      {hasReminders && (
        <RemindersFilter
          searchQuery={searchQuery}
          filterStatus={filterStatus}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSearchChange={(query) => {
            setSearchQuery(query);
            setCurrentPage(1);
          }}
          onFilterChange={(status) => {
            setFilterStatus(status);
            setCurrentPage(1);
          }}
          onSortChange={(sort) => {
            setSortBy(sort);
            setCurrentPage(1);
          }}
          onSortDirectionChange={(direction) => {
            setSortDirection(direction);
            setCurrentPage(1);
          }}
          onClearFilters={handleClearFilters}
          totalCount={reminders.length}
          filteredCount={filteredAndSortedReminders.length}
          selectedCount={selectedIds.size}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onDeleteSelected={handleDeleteSelected}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {!hasReminders && (
        <div className="RemindersList__empty">
          <p>No reminders yet</p>
          <p className="RemindersList__empty-hint">
            Create your first reminder to get started!
          </p>
        </div>
      )}

      {hasReminders && !hasFilteredResults && (
        <div className="RemindersList__no-results">
          <p>No reminders found</p>
          <p className="RemindersList__no-results-hint">
            Try adjusting your filters or search query
          </p>
        </div>
      )}

      {hasFilteredResults && (
        <div className="RemindersList__grid">
          {paginatedReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              isSelected={selectedIds.has(reminder.id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
