import { useEffect, useMemo, useState } from "react";
import type { Page } from "./types";
import { Icon } from "./Icon";
import type { ClaimHistoryItem, HistoryItem, ScoreTone } from "../models/resultModel";
import { getClaimHistory, removeClaim } from "../api/request/resultApi";


export function HistorySidebar({
    navigate,
    active = "new",
    activeId = null,
    historyItems,
    onHistoryChange,
}: {
    navigate: (p: Page, id?: string) => void;
    active?: "new" | "previous";
    activeId?: string | null;
    historyItems: HistoryItem[] | null;
    onHistoryChange: (items: HistoryItem[]) => void;
}) {
  const [checks, setChecks] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirmDelete, setConfirmDelete] = useState<HistoryItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Determine the score indicator colour.
  const getScoreTone = (score: number): ScoreTone => {
      if (score === 0) return "gray";
      if (score <= 0.20) return "red";
      if (score <= 0.50) return "amber";
      if (score <= 0.65) return "gray";
      return "green";
  };

  // Convert a timestamp into a date group.
  const getDayLabel = (dateString: string): string => {
      const date = new Date(dateString);

      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      const isSameDay = (a: Date, b: Date) =>
          a.getFullYear() === b.getFullYear() &&
          a.getMonth() === b.getMonth() &&
          a.getDate() === b.getDate();

      if (isSameDay(date, today)) return "TODAY";
      if (isSameDay(date, yesterday)) return "YESTERDAY";

      return date.toLocaleDateString("en-SG", {
          day: "numeric",
          month: "short",
          year: "numeric",
      }).toUpperCase();
  };

  // Format the submission time.
  const formatMeta = (
      submitTime: string,
      pointCount: number
  ): string => {
      const time = new Date(submitTime).toLocaleTimeString("en-SG", {
          hour: "numeric",
          minute: "2-digit",
      });

      return `${time} · ${pointCount} claims`;
  };

  // Retrieve verification history.
  useEffect(() => {
    let mounted = true;

    const fetchHistory = async () => {
        try {
            // If App.tsx already has history, display it immediately.
            if (historyItems !== null) {
                setLoading(false);
            } else {
                setLoading(true);
            }

            setError("");

            // Retrieve the latest history from the backend.
            const response = await getClaimHistory();

            if (!mounted) return;

            const items: HistoryItem[] = response.claims.map((item) => ({
                ...item,
                meta: formatMeta(
                    item.submit_time,
                    item.point_count
                ),
                tone: getScoreTone(item.score),
                day: getDayLabel(item.submit_time),
            }));

            // Update the shared history in App.tsx.
            onHistoryChange(items);

        } catch (err) {
            if (!mounted) return;

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to retrieve verification history."
            );
        } finally {
            if (mounted) {
                setLoading(false);
            }
        }
    };

    fetchHistory();

    return () => {
        mounted = false;
    };
  }, []);

  // Filter history based on search input.
  const filteredChecks = useMemo(() => {
      const keyword = search.trim().toLowerCase();

      if (!keyword) return historyItems ?? [];

      return (historyItems ?? []).filter((item) =>
          item.article_brief.toLowerCase().includes(keyword)
      );
  }, [historyItems, search]);

  // Group history by date.
  const groupedChecks = useMemo(() => {
      const groups: Record<string, HistoryItem[]> = {};

      filteredChecks.forEach((item) => {
          if (!groups[item.day]) {
              groups[item.day] = [];
          }

          groups[item.day].push(item);
      });

      return groups;
  }, [filteredChecks]);

  const renderChecks = (items: HistoryItem[]) =>
    items.map((item) => (
        <div
            className={`history-item ${
                active === "previous" && item.id === activeId
                    ? "active"
                    : ""
            }`}
            key={item.id}
        >
            <button
                className="history-main"
                onClick={() =>
                    navigate(
                        item.score === 0 ? "verify" : "results",
                        item.id
                    )
                }
            >
                <span className={`status-dot ${item.tone}`} />

                <span>
                    <strong>{item.article_brief}</strong>
                    <small>{item.meta}</small>
                </span>
            </button>

            <button
                className="history-delete"
                aria-label={`Delete ${item.article_brief}`}
                title="Delete fact-check"
                disabled={deleting}
                onClick={() => {
                    setDeleteError("");
                    setConfirmDelete(item);
                }}
            >
                <Icon name="x" size={13} />
            </button>
        </div>
    ));

  const handleDeleteClaim = async () => {
    if (!confirmDelete || deleting) return;

    const deletedId = confirmDelete.id;

    try {
        setDeleting(true);
        setDeleteError("");

        await removeClaim(deletedId);

        const updatedItems = (historyItems ?? []).filter(
            (item) => item.id !== deletedId
        );

        // Update App.tsx history and claimCount.
        onHistoryChange(updatedItems);

        setConfirmDelete(null);

        // Navigate only if the deleted claim is currently selected.
        if (deletedId === activeId) {
            navigate("verify");
        }

    } catch (err) {
        setDeleteError(
            err instanceof Error
                ? err.message
                : "Failed to delete verification."
        );
    } finally {
        setDeleting(false);
    }
  };

  return (
      <aside className="history-panel">
          <div className="history-title">
              <span>Verification history</span>

              <button onClick={() => navigate("verify")}>
                  +
              </button>
          </div>

          <div className="history-search">
              <Icon name="search" size={16} />

              <input
                  placeholder="Search history"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
          </div>

          {active === "new" && (
              <div className="history-item active">
                  <div className="history-main">
                      <span className="status-dot gray" />

                      <span>
                          <strong>New verification</strong>
                          <small>Not yet analysed</small>
                      </span>
                  </div>
              </div>
          )}

          {loading && historyItems === null && (
              <div className="history-loading">
                  <span className="history-spinner" />
              </div>
          )}

          {!loading && error && historyItems === null && (
              <div className="history-empty">
                  {error}
              </div>
          )}

          {/* {historyItems !== null && filteredChecks.length === 0 && (
              <div className="history-empty">
                  No verification history found.
              </div>
          )} */}

          {!loading && !error &&
              Object.entries(groupedChecks).map(([day, items]) => (
                  <div key={day}>
                      <span className="history-date">{day}</span>
                      {renderChecks(items)}
                  </div>
              ))
          }

          <div className="history-limit">
              <strong>{historyItems?.length ?? "0"} of 4 checks saved</strong>

              <div>
                  <i />
              </div>

              <button onClick={() => navigate("pricing")}>
                  Upgrade plan
              </button>
          </div>
          {confirmDelete && (
            <div
                className="delete-overlay"
                onClick={() => {
                    if (!deleting) {
                        setConfirmDelete(null);
                        setDeleteError("");
                    }
                }}
            >
                <div
                    className="delete-dialog"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-title"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="delete-dialog-icon">
                        <Icon name="x" size={22} />
                    </div>

                    <h3 id="delete-title">Delete verification?</h3>

                    <p>
                        Are you sure you want to delete this verification?
                        This action cannot be undone.
                    </p>

                    <strong className="delete-claim-title">
                        {confirmDelete.article_brief}
                    </strong>

                    {deleteError && (
                        <p className="delete-error">
                            {deleteError}
                        </p>
                    )}

                    <div className="delete-dialog-actions">
                        <button
                            className="delete-cancel"
                            disabled={deleting}
                            onClick={() => {
                                setConfirmDelete(null);
                                setDeleteError("");
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            className="delete-confirm"
                            disabled={deleting}
                            onClick={handleDeleteClaim}
                        >
                            {deleting ? "Deleting..." : "Yes, delete"}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </aside>
  );
}
