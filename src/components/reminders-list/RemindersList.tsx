import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IReminder } from "@/types";
import ReminderCard from "./ReminderCard";
import RemindersFilter, {
  type FilterStatus,
  type SortOption,
} from "./RemindersFilter";
import "./RemindersList.css";

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

  const { data: reminders, isPending, error } = useQuery({
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

    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "created") {
        return a.id - b.id;
      }
      return 0;
    });

    return filtered;
  }, [reminders, searchQuery, filterStatus, sortBy]);

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
    <div className="RemindersList">
      {hasReminders && (
        <RemindersFilter
          searchQuery={searchQuery}
          filterStatus={filterStatus}
          sortBy={sortBy}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilterStatus}
          onSortChange={setSortBy}
          onClearFilters={handleClearFilters}
          totalCount={reminders.length}
          filteredCount={filteredAndSortedReminders.length}
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
          {filteredAndSortedReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}
    </div>
  );
}
