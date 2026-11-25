import { useState } from "react";
import type { Page } from "../../common/types";
import { Icon } from "../../common/Icon";
import { HistorySidebar } from "../../common/HistorySidebar";
const checks = [
  {
    title: "Global average sea level has risen by more than 20 cm since 1900.",
    status: "Supported",
    tone: "green",
  },
  { title: "The rate of sea level rise is accelerating.", status: "Supported", tone: "green" },
  {
    title: "Sea levels will rise by exactly one metre by 2050.",
    status: "Misinformation",
    tone: "red",
  },
];

export function ResultsPage({ navigate, onEdit }: { navigate: (p: Page) => void; onEdit: () => void }) {
  const [selected, setSelected] = useState<number | null>(0);
  return (
    <main className="results-layout">
      <HistorySidebar navigate={navigate} active="result" />

      <section className="document-panel">
        <div className="result-toolbar">
          <div>
            <button onClick={() => navigate("verify")}>‹</button>
            <span>Analysis</span>
          </div>
          <div className="toolbar-actions">
            <button className="outline-icon" onClick={onEdit}>
              <Icon name="document" size={16} /> Edit
            </button>
            <button className="outline-icon">
              <Icon name="external" size={16} /> Share
            </button>
          </div>
        </div>
        <div className="document-content">
          <div className="doc-meta">
            <span>ARTICLE ANALYSIS</span>
            <small>Analysed just now</small>
          </div>
          <h1>Understanding global sea level rise</h1>
          <p>
            Global average sea level has risen by{" "}
            <mark className="supported" onClick={() => setSelected(0)}>
              more than 20 centimetres since 1900
            </mark>
            , according to long-term observational records.
          </p>
          <p>
            Scientists have also found that{" "}
            <mark className="supported" onClick={() => setSelected(1)}>
              the rate of sea level rise is accelerating
            </mark>{" "}
            as oceans warm and land ice melts.
          </p>
          <p>
            Some online reports suggest that{" "}
            <mark className="misinformation" onClick={() => setSelected(2)}>
              sea levels will rise by exactly one metre by 2050
            </mark>
            , creating severe disruption across all coastal cities.
          </p>
          <p>
            While sea level rise poses a serious and growing risk, projections vary significantly by
            location and depend on future emissions. Current research emphasises ranges and
            scenarios rather than a single certain outcome.
          </p>
          <div className="legend">
            <span>
              <i className="green" /> Supported
            </span>
            <span>
              <i className="red" /> Misinformation
            </span>
            <span>
              <i className="gray" /> Insufficient evidence
            </span>
          </div>
          <div className="claims-overview">
            <div>
              <strong>3</strong>
              <span>Claims identified</span>
            </div>
            <div>
              <strong className="green-text">2</strong>
              <span>Supported</span>
            </div>
            <div>
              <strong className="red-text">1</strong>
              <span>Misinformation</span>
            </div>
          </div>
        </div>
      </section>

      <aside className="assessment-panel">
        <div className="assessment-scroll">
          <div className="assessment-header">
            <span>AI assessment</span>
            <button>•••</button>
          </div>
          <div className="verdict-card">
            <div className="verdict-top">
              <div className="verdict-icon">
                <Icon name="shield" size={23} />
              </div>
              <span className="badge amber">PARTIALLY SUPPORTED</span>
            </div>
            <h2>Generally accurate, with one significant overstatement.</h2>
            <p>
              The central claims align with scientific consensus, but the precise 2050 projection is
              not supported by current evidence.
            </p>
            <small>
              <Icon name="clock" size={14} /> 5 sources reviewed · Updated just now
            </small>
          </div>
          <div className="breakdown-title">
            <span>Claim breakdown</span>
            <strong>{selected === null ? "Select a claim" : `${selected + 1} of 3`}</strong>
          </div>
          <div className="claim-list" aria-label="Claims identified">
            {checks.map((item, index) => (
              <div className="claim-list-item" key={item.title}>
                <button
                  className={selected === index ? "selected" : ""}
                  onClick={() => setSelected((current) => (current === index ? null : index))}
                  aria-expanded={selected === index}
                >
                  <span className={`status-dot ${item.tone}`} />
                  <span>
                    <small>CLAIM {index + 1}</small>
                    <strong>{item.title}</strong>
                  </span>
                  <Icon name="chevron" size={15} />
                </button>
                {selected === index && <ClaimBreakdown selected={index} navigate={navigate} />}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}

function ClaimBreakdown({ selected, navigate }: { selected: number; navigate: (p: Page) => void }) {
  return (
    <div className="inline-claim-breakdown">
      <div className="claim-detail">
        <span className={`badge ${checks[selected].tone}`}>
          {checks[selected].status.toUpperCase()}
        </span>
        <h3>“{checks[selected].title}”</h3>
        <p>
          {selected === 0
            ? "Multiple independent datasets support this statement. NASA and the IPCC estimate global mean sea level has risen approximately 20–23 cm since 1901."
            : selected === 1
              ? "Satellite observations show the annual rate has increased from about 1.4 mm per year during much of the 20th century to roughly 3.7 mm per year recently."
              : "Current major scientific projections do not support a certain one-metre rise by 2050. This figure is closer to some high-emissions projections for 2100, not mid-century."}
        </p>
      </div>
      <div className="evidence-heading">
        <span>{selected === 2 ? "Contradicting evidence" : "Supporting evidence"}</span>
        <small>5 SOURCES</small>
      </div>
      <Evidence
        title={
          selected === 2
            ? "Sixth Assessment Report: Sea Level Change"
            : "Global Climate Change: Vital Signs"
        }
        source={selected === 2 ? "IPCC · 2023" : "NASA · January 2024"}
        text={
          selected === 2
            ? "Likely global mean sea level rise by 2050 is 0.15–0.29 m relative to 1995–2014."
            : "Global sea level rose about 21–24 centimetres since 1880."
        }
      />
      <Evidence
        title={selected === 2 ? "Sea Level Projection Tool" : "The Ocean and Cryosphere"}
        source={selected === 2 ? "NASA · 2023" : "IPCC · September 2019"}
        text={
          selected === 2
            ? "Mid-century projections remain well below one metre across assessed emissions pathways."
            : "Mean sea level rose by 0.16 m between 1902 and 2015."
        }
      />
      <Evidence
        title="Global and Regional Sea Level Rise Scenarios"
        source="NOAA · February 2022"
        text="Multiple observation systems confirm long-term global sea level change."
      />
      <LockedEvidence index={4} navigate={navigate} />
      <LockedEvidence index={5} navigate={navigate} />
      <p className="ai-caveat">
        <Icon name="sparkles" size={16} /> AI-generated assessment. Review the cited sources and use
        independent judgement.
      </p>
    </div>
  );
}

function LockedEvidence({ index, navigate }: { index: number; navigate: (p: Page) => void }) {
  return (
    <article className="evidence-card locked">
      <div className="locked-blur">
        <strong>
          {index === 4 ? "Observed Sea Level Indicators" : "Climate Change Evidence Review"}
        </strong>
        <span>Trusted research source</span>
        <p>Additional evidence and detailed source context is available with Premium.</p>
      </div>
      <div className="lock-cover">
        <Icon name="shield" size={18} />
        <strong>Premium evidence</strong>
        <button onClick={() => navigate("pricing")}>Unlock</button>
      </div>
    </article>
  );
}

function Evidence({ title, source, text }: { title: string; source: string; text: string }) {
  return (
    <article className="evidence-card">
      <div>
        <strong>{title}</strong>
        <Icon name="external" size={15} />
      </div>
      <span>{source}</span>
      <p>“{text}”</p>
    </article>
  );
}
