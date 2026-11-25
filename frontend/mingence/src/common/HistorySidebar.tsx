import { useState } from "react";
import type { Page } from "./types";
import { Icon } from "./Icon";
export function HistorySidebar({
  navigate,
  active = "new",
}: {
  navigate: (p: Page) => void;
  active?: "new" | "result";
}) {
  const [checks, setChecks] = useState([
    {
      id: "sea-level",
      title: "Sea level rise since 1900",
      meta: "Most recent · 3 claims",
      tone: "amber",
      day: "today",
    },
    {
      id: "vitamin-d",
      title: "Vitamin D and immunity",
      meta: "10:24 AM · 2 claims",
      tone: "green",
      day: "today",
    },
    {
      id: "electric-vehicles",
      title: "Electric vehicle emissions",
      meta: "4:18 PM · 4 claims",
      tone: "red",
      day: "yesterday",
    },
    {
      id: "remote-work",
      title: "Remote work productivity",
      meta: "11:02 AM · 2 claims",
      tone: "gray",
      day: "yesterday",
    },
  ]);
  const renderChecks = (day: string) =>
    checks
      .filter((item) => item.day === day)
      .map((item) => (
        <div
          className={`history-item ${active === "result" && item.id === "sea-level" ? "active" : ""}`}
          key={item.id}
        >
          <button
            className="history-main"
            onClick={() => item.id === "sea-level" && navigate("results")}
          >
            <span className={`status-dot ${item.tone}`} />
            <span>
              <strong>{item.title}</strong>
              <small>{item.meta}</small>
            </span>
          </button>
          <button
            className="history-delete"
            aria-label={`Delete ${item.title}`}
            title="Delete fact-check"
            onClick={() => setChecks((current) => current.filter((check) => check.id !== item.id))}
          >
            <Icon name="x" size={13} />
          </button>
        </div>
      ));
  return (
    <aside className="history-panel">
      <div className="history-title">
        <span>Verification history</span>
        <button onClick={() => navigate("verify")}>+</button>
      </div>
      <div className="history-search">
        <Icon name="search" size={16} />
        <input placeholder="Search history" />
      </div>
      <span className="history-date">TODAY</span>
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
      {renderChecks("today")}
      <span className="history-date">YESTERDAY</span>
      {renderChecks("yesterday")}
      <div className="history-limit">
        <strong>{checks.length} of 4 checks saved</strong>
        <div>
          <i />
        </div>
        <button onClick={() => navigate("pricing")}>Upgrade plan</button>
      </div>
    </aside>
  );
}
