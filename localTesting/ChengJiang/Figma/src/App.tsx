import { createClient, User } from "@supabase/supabase-js";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

type Page =
  | "home"
  | "verify"
  | "results"
  | "pricing"
  | "login"
  | "register"
  | "forgot-password"
  | "reset-password"
  | "confirm-email"
  | "profile"
  | "payment"
  | "payment-success"
  | "about"
  | "contact"
  | "privacy"
  | "terms";
type PaidPlan = "Premium" | "Premium Plus";
const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);
type IconName =
  | "arrow"
  | "bolt"
  | "camera"
  | "check"
  | "chevron"
  | "clock"
  | "document"
  | "external"
  | "eye"
  | "google"
  | "history"
  | "link"
  | "menu"
  | "search"
  | "shield"
  | "sparkles"
  | "x";

const icons: Record<IconName, ReactNode> = {
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  bolt: <path d="m13 2-8 11h7l-1 9 8-12h-7l1-8Z" />,
  camera: (
    <>
      <path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3h5Z" />
      <circle cx="12" cy="13" r="3" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  document: (
    <>
      <path d="M6 2h8l4 4v16H6z" />
      <path d="M14 2v5h5M9 12h6M9 16h6" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  google: (
    <>
      <path d="M21.3 12.2c0-.7-.1-1.5-.2-2.2H12v4h5.2a4.5 4.5 0 0 1-2 2.9v2.6h3.3c1.9-1.8 2.8-4.4 2.8-7.3Z" />
      <path d="M12 21.5c2.7 0 5-.9 6.6-2.4l-3.3-2.6c-.9.6-2.1 1-3.3 1-2.5 0-4.7-1.7-5.5-4h-3.4v2.7a10 10 0 0 0 8.9 5.3Z" />
      <path d="M6.5 13.5A6 6 0 0 1 6.2 12c0-.5.1-1 .3-1.5V7.8H3.1A10 10 0 0 0 2 12c0 1.5.4 2.9 1.1 4.2l3.4-2.7Z" />
      <path d="M12 6.5c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.7 9.7 0 0 0 12 2.5a10 10 0 0 0-8.9 5.3l3.4 2.7c.8-2.3 3-4 5.5-4Z" />
    </>
  ),
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5M12 7v5l4 2" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3Z" />
      <path d="m9 12 2 2 4-5" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.1 3.1L16 7.5l-2.9 1.4L12 12l-1.1-3.1L8 7.5l2.9-1.4L12 3Z" />
      <path d="m18 13 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13ZM5.5 11l.7 1.8 1.8.7-1.8.7L5.5 16l-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
    </>
  ),
  x: <path d="m6 6 12 12M18 6 6 18" />,
};

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <button className="logo" onClick={onClick} aria-label="Mingence home">
      <span className="logo-mark">
        <span>明</span>
      </span>
      <span className="logo-word">MINGENCE</span>
    </button>
  );
}

function Header({
  page,
  navigate,
  user,
}: {
  page: Page;
  navigate: (page: Page) => void;
  user: User | null;
}) {
  const [open, setOpen] = useState(false);
  const go = (target: Page) => {
    navigate(target);
    setOpen(false);
  };
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Logo onClick={() => go("home")} />
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <Icon name={open ? "x" : "menu"} />
        </button>
        <nav className={open ? "nav-links open" : "nav-links"}>
          <button
            onClick={() => {
              go("home");
              setTimeout(
                () => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" }),
                50,
              );
            }}
          >
            How it works
          </button>
          <button className={page === "pricing" ? "active" : ""} onClick={() => go("pricing")}>
            Pricing
          </button>
          <button className="mobile-account-link" onClick={() => go(user ? "profile" : "login")}>
            {user ? "Profile" : "Log in"}
          </button>
          <button
            className="mobile-account-link"
            onClick={async () => {
              if (user) {
                await supabase.auth.signOut();
                go("home");
              } else {
                go("register");
              }
            }}
          >
            {user ? "Log out" : "Create account"}
          </button>
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <button className="text-btn" onClick={() => go("profile")}>
                Profile
              </button>
              <button
                className="primary-btn small"
                onClick={async () => {
                  await supabase.auth.signOut();
                  go("home");
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button className="text-btn" onClick={() => go("login")}>
                Log in
              </button>
              <button className="primary-btn small" onClick={() => go("register")}>
                Get started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Home({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <>
      <div className="home-layout">
        <main className="home-main">
          <section className="hero">
            <div className="hero-glow glow-one" />
            <div className="hero-glow glow-two" />
            <div className="hero-inner">
              <div className="eyebrow">
                <Icon name="sparkles" size={16} /> AI-assisted fact verification
              </div>
              <h1>
                Clarity for every
                <br />
                <span>claim you encounter.</span>
              </h1>
              <p className="hero-copy">
                Uncover the truth behind information through AI-powered analysis and evidence-based
                verification.
              </p>
              <button className="primary-btn hero-start" onClick={() => navigate("register")}>
                Get started for free <Icon name="arrow" size={18} />
              </button>
              <div className="trust-row">
                <span>Research grounded in trusted sources</span>
                <i />
                <span>Transparent evidence</span>
                <i />
                <span>Responsible AI</span>
              </div>
            </div>
          </section>

          <section className="features section" id="how">
            <div className="section-heading">
              <div>
                <span className="section-label">WHY MINGENCE</span>
                <h2>
                  Verification you can understand,
                  <br />
                  not just accept.
                </h2>
              </div>
              <p>
                Mingence combines advanced language models with credible research to show you not
                only the result, but the evidence behind it.
              </p>
            </div>
            <div className="feature-grid">
              {[
                [
                  "sparkles",
                  "AI-powered analysis",
                  "Break complex content into verifiable claims and identify potentially misleading language in seconds.",
                ],
                [
                  "search",
                  "Evidence-based research",
                  "Search across reliable publications, academic sources and trusted institutions for relevant evidence.",
                ],
                [
                  "eye",
                  "Transparent insights",
                  "See exactly which sources support or challenge a claim, with clear explanations and careful context.",
                ],
              ].map(([icon, title, text], i) => (
                <article className="feature-card" key={title}>
                  <div className={`feature-icon icon-${i}`}>
                    <Icon name={icon as IconName} size={23} />
                  </div>
                  <span className="card-number">0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <button onClick={() => navigate("verify")}>
                    Learn more <Icon name="arrow" size={16} />
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="steps-section">
            <div className="section steps">
              <div className="steps-copy">
                <span className="section-label">HOW IT WORKS</span>
                <h2>From uncertainty to insight in three simple steps.</h2>
                <p>
                  No specialist knowledge needed. Mingence makes rigorous fact-checking accessible
                  to everyone.
                </p>
                <button className="outline-btn" onClick={() => navigate("verify")}>
                  Start verifying <Icon name="arrow" size={17} />
                </button>
              </div>
              <div className="step-list">
                {[
                  [
                    "01",
                    "Submit the information",
                    "Paste a claim, article or URL—or upload an image of the content.",
                  ],
                  [
                    "02",
                    "Mingence investigates",
                    "Our AI identifies key claims and retrieves relevant evidence from credible sources.",
                  ],
                  [
                    "03",
                    "Explore the assessment",
                    "Review a clear verdict, claim-by-claim analysis and all referenced evidence.",
                  ],
                ].map(([n, title, text]) => (
                  <div className="step" key={n}>
                    <span>{n}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="home-pricing section">
            <div className="section-heading compact">
              <div>
                <span className="section-label">PLANS FOR EVERY NEED</span>
                <h2>Start free. Upgrade for deeper insight.</h2>
              </div>
              <p>
                Every plan includes secure submissions, trusted-source research and transparent AI
                assessments.
              </p>
            </div>
            <div className="home-plan-grid">
              {plans.map((plan) => (
                <article key={plan.name}>
                  <div>
                    <h3>{plan.name}</h3>
                    <strong>
                      {plan.price}
                      <small>/month</small>
                    </strong>
                  </div>
                  <p>
                    {plan.features[0]} · {plan.features[1]}
                  </p>
                </article>
              ))}
            </div>
            <button className="outline-btn view-pricing" onClick={() => navigate("pricing")}>
              Compare all plans <Icon name="arrow" size={17} />
            </button>
          </section>

          <section className="cta section">
            <div>
              <span className="cta-mark">明</span>
              <h2>
                Make informed decisions
                <br />
                with greater confidence.
              </h2>
              <p>Start your first AI-assisted verification today.</p>
            </div>
            <button className="white-btn" onClick={() => navigate("register")}>
              Create free account <Icon name="arrow" size={18} />
            </button>
          </section>
        </main>
        <AdSidebar />
      </div>
      <Footer navigate={navigate} />
    </>
  );
}

const dynamicAdCreatives = [
  [
    {
      kicker: "FEATURED RESOURCE",
      title: "Build stronger research habits",
      text: "A practical guide to evaluating online sources and identifying misleading claims.",
      tone: "blue",
    },
    {
      kicker: "STUDENT TOOLKIT",
      title: "Citations made simpler",
      text: "Organise references and create cleaner bibliographies for your next research project.",
      tone: "violet",
    },
    {
      kicker: "DIGITAL LITERACY",
      title: "Pause before you share",
      text: "Learn five quick checks for spotting unreliable information in your daily feed.",
      tone: "teal",
    },
  ],
  [
    {
      kicker: "ACADEMIC WRITING",
      title: "Turn notes into clear arguments",
      text: "A guided workspace for organising evidence before your next essay or report.",
      tone: "violet",
    },
    {
      kicker: "SOURCE CHECK",
      title: "Know who published it",
      text: "Quickly explore author credentials, publication history and source transparency.",
      tone: "teal",
    },
    {
      kicker: "RESEARCH PLANNER",
      title: "Make every study session count",
      text: "Build a focused research plan and keep your most useful sources close at hand.",
      tone: "blue",
    },
  ],
];

function AdSidebar({ compact = false }: { compact?: boolean }) {
  const [creativeSet, setCreativeSet] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(
      () => setCreativeSet((current) => (current + 1) % dynamicAdCreatives.length),
      10000,
    );
    return () => window.clearInterval(timer);
  }, []);
  const ads = dynamicAdCreatives[creativeSet];
  return (
    <aside className={compact ? "ad-sidebar compact" : "ad-sidebar"}>
      <span className="ad-label">DYNAMIC ADVERTISEMENT</span>
      <div className="ad-stack">
        {ads.map((ad, index) => (
          <div className="ad-card" key={`${creativeSet}-${ad.title}`}>
            <div className={`ad-visual ${ad.tone}`}>
              <span>{index === 0 ? "明" : index === 1 ? "Aa" : "✓"}</span>
              <i />
              <i />
            </div>
            <small>{ad.kicker}</small>
            <h3>{ad.title}</h3>
            <p>{ad.text}</p>
            <button>
              Learn more <Icon name="external" size={14} />
            </button>
            <span className="ad-provider">Dynamic creative · Kaboodle-style feed</span>
          </div>
        ))}
      </div>
      <div className="ad-support">
        <Icon name="shield" size={18} />
        <p>
          <strong>Why am I seeing ads?</strong>Ads help support our operating costs and enable
          Mingence to offer fact-checking tools for free.
        </p>
      </div>
    </aside>
  );
}

function HistorySidebar({
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

function Verify({
  initialClaim,
  onComplete,
  navigate,
}: {
  initialClaim: string;
  onComplete: (text: string) => void;
  navigate: (p: Page) => void;
}) {
  const [text, setText] = useState(initialClaim);
  const [urlOpen, setUrlOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!processing) return;
    const id = window.setInterval(
      () =>
        setProgress((p) => {
          if (p >= 100) {
            window.clearInterval(id);
            setTimeout(() => onComplete(text), 350);
            return 100;
          }
          return Math.min(100, p + 4);
        }),
      80,
    );
    return () => window.clearInterval(id);
  }, [processing, onComplete, text]);

  return (
    <main className="verify-workspace">
      <HistorySidebar navigate={navigate} />
      <section className="app-bg verify-page">
        <div className="verify-shell">
          <div className="verify-heading">
            <span className="section-label">NEW VERIFICATION</span>
            <h1>What would you like to verify?</h1>
            <p>Submit content and Mingence will analyse it against reliable, relevant evidence.</p>
          </div>
          <div className="verify-card">
            <div className="input-heading">
              <Icon name="search" size={18} />
              <span>
                <strong>Claim</strong>
                <small>Enter one statement you want Mingence to investigate.</small>
              </span>
            </div>
            <div className="quick-inputs">
              <button onClick={() => setUrlOpen(!urlOpen)}>
                <Icon name="link" />{" "}
                <span>
                  <strong>Enter a URL</strong>
                  <small>Analyse a web page or article</small>
                </span>
                <Icon name="chevron" size={18} />
              </button>
              <label>
                <Icon name="camera" />
                <span>
                  <strong>Upload an image</strong>
                  <small>JPG, PNG or WEBP, up to 10 MB</small>
                </span>
                <input type="file" accept="image/*" />
                <Icon name="chevron" size={18} />
              </label>
            </div>
            {urlOpen && (
              <div className="url-row">
                <Icon name="link" size={18} />
                <input autoFocus placeholder="https://example.com/article" />
                <button>Import</button>
              </div>
            )}
            <div className="or">
              <span>or enter content below</span>
            </div>
            <div className="text-entry">
              <label>Statement or claim</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={600}
                placeholder="e.g. Global sea levels have risen by more than 20 cm since 1900."
              />
              <span>{text.length} / 600</span>
            </div>
            <div className="verify-footer">
              <p>
                <Icon name="shield" size={17} /> Your submission is private and handled securely.
              </p>
              <button
                className="primary-btn"
                disabled={!text.trim() || processing}
                onClick={() => {
                  setProgress(5);
                  setProcessing(true);
                }}
              >
                {processing ? "Analysing..." : "Analyse content"}{" "}
                {!processing && <Icon name="arrow" size={18} />}
              </button>
            </div>
          </div>
          <div className="verify-notice">
            <Icon name="bolt" size={19} />
            <div>
              <strong>How Mingence assesses content</strong>
              <p>
                Results are generated using AI and evidence retrieval. They support critical
                thinking but should not replace professional advice or independent research.
              </p>
            </div>
          </div>
        </div>
      </section>
      <AdSidebar compact />
      {processing && (
        <div className="loading-overlay">
          <div className="loading-dialog">
            <span className="ad-label">ADVERTISEMENT</span>
            <div className="loading-ad">
              <div>
                <span>明</span>
              </div>
              <small>RESEARCH ESSENTIALS</small>
              <h2>Read critically. Research confidently.</h2>
              <p>A free guide to recognising trustworthy sources online.</p>
              <button>Explore the guide</button>
            </div>
            <div className="processing">
              <div className="processing-top">
                <span>
                  <Icon name="sparkles" size={17} />{" "}
                  {progress < 36
                    ? "Identifying claims..."
                    : progress < 72
                      ? "Retrieving trusted evidence..."
                      : "Preparing your assessment..."}
                </span>
                <strong>{progress}%</strong>
              </div>
              <div className="progress-track">
                <i style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

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

function Results({ navigate, onEdit }: { navigate: (p: Page) => void; onEdit: () => void }) {
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

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "For occasional checks and everyday curiosity.",
    features: ["4 stored fact-checks", "Basic analysis details", "Core evidence references"],
    cta: "Start for free",
  },
  {
    name: "Premium",
    price: "$10",
    desc: "For students, researchers and active readers.",
    features: [
      "8 stored fact-checks",
      "Extended evidence analysis",
      "Detailed claim breakdowns",
      "Side-page ads only",
    ],
    cta: "Choose Premium",
    featured: true,
  },
  {
    name: "Premium Plus",
    price: "$20",
    desc: "For professionals who need verification without limits.",
    features: [
      "Unlimited fact-checks",
      "Extended evidence analysis",
      "Detailed claim breakdowns",
      "Completely ad-free",
    ],
    cta: "Choose Premium Plus",
  },
];

function Pricing({
  navigate,
  onChoose,
}: {
  navigate: (p: Page) => void;
  onChoose: (plan: PaidPlan) => void;
}) {
  return (
    <main className="pricing-page">
      <div className="pricing-head">
        <span className="section-label">SIMPLE PRICING</span>
        <h1>Choose the clarity you need.</h1>
        <p>Start free, then upgrade whenever you need deeper analysis and more space.</p>
      </div>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <article className={plan.featured ? "plan featured" : "plan"} key={plan.name}>
            {plan.featured && <span className="popular">MOST POPULAR</span>}
            <h2>{plan.name}</h2>
            <p>{plan.desc}</p>
            <div className="price">
              {plan.price}
              <span>/ month</span>
            </div>
            <button
              className={plan.featured ? "primary-btn" : "outline-btn"}
              onClick={() =>
                plan.name === "Free" ? navigate("register") : onChoose(plan.name as PaidPlan)
              }
            >
              {plan.cta}
            </button>
            <div className="plan-divider" />
            <strong>What’s included</strong>
            <ul>
              {plan.features.map((x) => (
                <li key={x}>
                  <span>
                    <Icon name="check" size={14} />
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="pricing-note">
        All plans include secure submissions, trusted-source retrieval and transparent AI
        assessments.
      </p>
    </main>
  );
}

function Auth({ mode, navigate }: { mode: "login" | "register"; navigate: (p: Page) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { display_name: String(form.get("displayName")) },
              emailRedirectTo: `${window.location.origin}/?page=confirm-email`,
            },
          });
    setBusy(false);
    if (result.error) {
      setError(result.error.message);
    } else if (mode === "login") {
      navigate("results");
    } else {
      setSubmitted(true);
    }
  };
  const google = async () => {
    setError("");
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/?page=login` },
    });
    if (authError) setError(authError.message);
  };
  return (
    <main className="auth-page">
      <section className="auth-brand">
        <Logo onClick={() => navigate("home")} />
        <div>
          <div className="auth-art">
            <span>明</span>
            <i className="ring r1" />
            <i className="ring r2" />
            <i className="dot d1" />
            <i className="dot d2" />
          </div>
          <blockquote>
            “The truth is rarely simple.
            <br />
            Understanding it can be.”
          </blockquote>
          <p>AI-assisted verification, grounded in evidence.</p>
        </div>
        <small>© 2025 Mingence. Responsible AI for informed decisions.</small>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-form">
          <span className="auth-kicker">{mode === "login" ? "WELCOME BACK" : "GET STARTED"}</span>
          <h1>{mode === "login" ? "Log in to Mingence" : "Create your account"}</h1>
          <p>
            {mode === "login"
              ? "Continue where you left off."
              : "Start verifying information with greater clarity."}
          </p>
          {submitted ? (
            <div className="success-message">
              <span>
                <Icon name="check" />
              </span>
              <h2>{mode === "login" ? "Welcome back." : "Check your email"}</h2>
              <p>
                {mode === "login"
                  ? "Your workspace is ready."
                  : "Check your email to confirm your account, then log in."}
              </p>
              <button
                className="primary-btn"
                onClick={() => navigate(mode === "login" ? "results" : "login")}
              >
                {mode === "login" ? "View last analysis" : "Return to log in"}{" "}
                <Icon name="arrow" size={18} />
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <button type="button" className="google-btn" onClick={google}>
                <Icon name="google" size={20} /> Continue with Google
              </button>
              <div className="or">
                <span>or continue with email</span>
              </div>
              {mode === "register" && (
                <label>
                  Display name
                  <input required name="displayName" placeholder="How others will see you" />
                </label>
              )}
              <label>
                Email address
                <input required name="email" type="email" placeholder="you@example.com" />
              </label>
              <label>
                <span>
                  Password{" "}
                  {mode === "login" && (
                    <button type="button" onClick={() => navigate("forgot-password")}>
                      Forgot password?
                    </button>
                  )}
                </span>
                <input
                  required
                  name="password"
                  type="password"
                  minLength={8}
                  placeholder={mode === "login" ? "Enter your password" : "Create a password"}
                />
              </label>
              {error && <p className="form-error">{error}</p>}
              <button className="primary-btn auth-submit" disabled={busy}>
                {busy ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}{" "}
                {!busy && <Icon name="arrow" size={18} />}
              </button>
              {mode === "register" && (
                <small className="terms">
                  By creating an account, you agree to our Terms and Privacy Policy.
                </small>
              )}
            </form>
          )}
          <p className="auth-switch">
            {mode === "login" ? "New to Mingence?" : "Already have an account?"}{" "}
            <button onClick={() => navigate(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Create an account" : "Log in"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

function SimpleAuthPage({
  navigate,
  mode,
}: {
  navigate: (p: Page) => void;
  mode: "forgot" | "reset";
}) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const result =
      mode === "forgot"
        ? await supabase.auth.resetPasswordForEmail(String(form.get("email")), {
            redirectTo: `${window.location.origin}/?page=reset-password`,
          })
        : await supabase.auth.updateUser({ password: String(form.get("password")) });
    setBusy(false);
    if (result.error) {
      setStatus(result.error.message);
    } else {
      setStatus(
        mode === "forgot"
          ? "If an account exists for that address, a secure reset link is on its way."
          : "Your password has been changed. You can now continue to your profile.",
      );
    }
  };
  return (
    <main className="single-auth-page">
      <Logo onClick={() => navigate("home")} />
      <section className="single-auth-card">
        <span className="auth-kicker">
          {mode === "forgot" ? "ACCOUNT RECOVERY" : "SECURE RESET LINK"}
        </span>
        <h1>{mode === "forgot" ? "Forgot your password?" : "Choose a new password"}</h1>
        <p>
          {mode === "forgot"
            ? "Enter your account email and we’ll send you a one-time password reset URL."
            : "This page uses the secure recovery URL from your email to update your password."}
        </p>
        <form onSubmit={submit}>
          {mode === "forgot" ? (
            <label>
              Email address
              <input required name="email" type="email" placeholder="you@example.com" />
            </label>
          ) : (
            <label>
              New password
              <input
                required
                name="password"
                type="password"
                minLength={8}
                placeholder="At least 8 characters"
              />
            </label>
          )}
          {status && <p className="form-status">{status}</p>}
          <button className="primary-btn auth-submit" disabled={busy}>
            {busy ? "Please wait..." : mode === "forgot" ? "Send reset URL" : "Change password"}
          </button>
        </form>
        <button
          className="back-link"
          onClick={() => navigate(mode === "forgot" ? "login" : "profile")}
        >
          {mode === "forgot" ? "Back to log in" : "Continue"}
        </button>
      </section>
    </main>
  );
}

function EmailConfirmation({ navigate }: { navigate: (p: Page) => void }) {
  const [state, setState] = useState<"checking" | "confirmed" | "error">("checking");
  const [message, setMessage] = useState("Confirming your email address securely...");
  useEffect(() => {
    const confirm = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      let { data } = await supabase.auth.getSession();
      if (!data.session && code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setState("error");
          setMessage("This confirmation link is invalid or has expired.");
          return;
        }
        ({ data } = await supabase.auth.getSession());
      }
      if (data.session) {
        setState("confirmed");
        setMessage("Your email has been confirmed. Your Mingence account is ready.");
      } else {
        setState("error");
        setMessage("This confirmation link is invalid or has expired.");
      }
    };
    window.setTimeout(confirm, 250);
  }, []);
  return (
    <main className="single-auth-page">
      <Logo onClick={() => navigate("home")} />
      <section className="single-auth-card confirmation-card">
        <span className={`confirmation-icon ${state}`}>
          {state === "checking" ? (
            <Icon name="clock" />
          ) : (
            <Icon name={state === "confirmed" ? "check" : "x"} />
          )}
        </span>
        <span className="auth-kicker">EMAIL CONFIRMATION</span>
        <h1>
          {state === "checking"
            ? "Checking your link"
            : state === "confirmed"
              ? "Email confirmed"
              : "We couldn’t confirm your email"}
        </h1>
        <p>{message}</p>
        {state !== "checking" && (
          <button
            className="primary-btn auth-submit"
            onClick={() => navigate(state === "confirmed" ? "results" : "register")}
          >
            {state === "confirmed" ? "Continue to your workspace" : "Create an account"}
          </button>
        )}
      </section>
    </main>
  );
}

function Profile({ user, navigate }: { user: User | null; navigate: (p: Page) => void }) {
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const changePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password"));
    const { error } = await supabase.auth.updateUser({ password });
    setMessage(error?.message ?? "Password updated successfully.");
    if (!error) e.currentTarget.reset();
  };
  const softDelete = async () => {
    const { data } = await supabase.auth.getSession();
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-3aca330f/account`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.session?.access_token}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setMessage(body.error ?? "Account deletion is unavailable. Please contact support.");
      return;
    }
    await supabase.auth.signOut();
    navigate("home");
  };
  if (!user) {
    return (
      <ContentPage title="Your profile" eyebrow="ACCOUNT">
        <p>Please log in to view or update your profile.</p>
        <button className="primary-btn" onClick={() => navigate("login")}>
          Log in
        </button>
      </ContentPage>
    );
  }
  return (
    <main className="profile-page">
      <div className="profile-shell">
        <div className="profile-heading">
          <span className="section-label">ACCOUNT SETTINGS</span>
          <h1>Your profile</h1>
          <p>Manage your Mingence account and security.</p>
        </div>
        <div className="profile-grid">
          <section className="settings-card">
            <h2>Profile details</h2>
            <dl>
              <div>
                <dt>Display name</dt>
                <dd>{user.user_metadata.display_name || "Not set"}</dd>
              </div>
              <div>
                <dt>Email address</dt>
                <dd>{user.email}</dd>
              </div>
            </dl>
          </section>
          <section className="settings-card">
            <h2>Change password</h2>
            <form onSubmit={changePassword}>
              <label>
                New password
                <input
                  required
                  name="password"
                  minLength={8}
                  type="password"
                  placeholder="At least 8 characters"
                />
              </label>
              <button className="primary-btn">Update password</button>
            </form>
          </section>
          <section className="settings-card danger-card">
            <h2>Delete account</h2>
            <p>
              Soft deletion anonymises your display name and email with non-reversible hashes,
              disables access and retains only the record needed for integrity.
            </p>
            {!confirmDelete ? (
              <button className="danger-btn" onClick={() => setConfirmDelete(true)}>
                Delete my account
              </button>
            ) : (
              <div className="delete-confirm">
                <strong>This cannot be undone. Continue?</strong>
                <button className="danger-btn" onClick={softDelete}>
                  Yes, anonymise my account
                </button>
                <button onClick={() => setConfirmDelete(false)}>Cancel</button>
              </div>
            )}
          </section>
        </div>
        {message && <p className="profile-message">{message}</p>}
      </div>
    </main>
  );
}

function ContentPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="content-page">
      <article>
        <span className="section-label">{eyebrow}</span>
        <h1>{title}</h1>
        <div className="content-body">{children}</div>
      </article>
    </main>
  );
}

function InfoPage({ page, navigate }: { page: Page; navigate: (p: Page) => void }) {
  if (page === "about")
    return (
      <ContentPage eyebrow="COMPANY" title="About Mingence">
        <p className="lead">
          Mingence is a student project exploring how thoughtful AI assistance can help people
          evaluate claims and engage more critically with online information.
        </p>
        <h2>Built for learning</h2>
        <p>
          The platform is designed for students, researchers and public-interest users who want a
          clear starting point for evidence-based verification. Assessments are educational and
          should be checked against original sources.
        </p>
        <h2>Our approach</h2>
        <p>
          We prioritise transparent evidence, understandable explanations and responsible use of AI
          rather than presenting automated output as unquestionable truth.
        </p>
      </ContentPage>
    );
  if (page === "contact")
    return (
      <ContentPage eyebrow="COMPANY" title="Contact us">
        <p className="lead">
          Mingence is a student project. Questions, feedback and educational collaboration ideas are
          welcome.
        </p>
        <div className="contact-box">
          <strong>General enquiries</strong>
          <a href="mailto:hello@mingence.example">hello@mingence.example</a>
          <small>We aim to respond within five working days.</small>
        </div>
        <button className="outline-btn" onClick={() => navigate("home")}>
          Return home
        </button>
      </ContentPage>
    );
  if (page === "privacy")
    return (
      <ContentPage eyebrow="LEGAL" title="Privacy policy">
        <p className="legal-date">Last updated: 6 March 2026</p>
        <h2>What we collect</h2>
        <p>
          We collect the account details you provide, authentication information managed by
          Supabase, and content you submit for verification.
        </p>
        <h2>How information is used</h2>
        <p>
          Data collected by Mingence is used only to provide, secure and improve the requested
          service. It will not be sold, used for advertising profiles, or used for any unrelated
          purpose.
        </p>
        <h2>Account deletion</h2>
        <p>
          Soft-deleted accounts have identifying details replaced with non-reversible hashes and can
          no longer be accessed.
        </p>
        <h2>Student project notice</h2>
        <p>
          Mingence is a student project and should not be used to submit highly sensitive or
          confidential information.
        </p>
      </ContentPage>
    );
  return (
    <ContentPage eyebrow="LEGAL" title="Terms of use">
      <p className="legal-date">Last updated: 6 March 2026</p>
      <h2>Educational service</h2>
      <p>
        Mingence is a student project. Its AI-assisted assessments support research and critical
        thinking but do not replace professional, legal, medical or academic advice.
      </p>
      <h2>Responsible use</h2>
      <p>
        You agree not to misuse the service, interfere with its operation, or submit content you do
        not have the right to process.
      </p>
      <h2>Your information</h2>
      <p>
        Information collected to operate Mingence will not be used for other purposes, sold to third
        parties or repurposed for unrelated marketing.
      </p>
      <h2>Verification results</h2>
      <p>
        Results may contain errors. Review cited evidence and use independent judgement before
        making important decisions.
      </p>
    </ContentPage>
  );
}

function Payment({ plan, navigate }: { plan: PaidPlan; navigate: (p: Page) => void }) {
  const price = plan === "Premium" ? 10 : 20;
  const [busy, setBusy] = useState(false);
  const pay = (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    window.setTimeout(() => navigate("payment-success"), 900);
  };
  return (
    <main className="payment-page">
      <div className="payment-shell">
        <section className="checkout-card">
          <span className="simulation-badge">SIMULATED CHECKOUT · NO CHARGE WILL BE MADE</span>
          <h1>Complete your upgrade</h1>
          <p>Use any realistic test details to preview the payment experience.</p>
          <form onSubmit={pay}>
            <label>
              Name on card
              <input required placeholder="Alex Morgan" />
            </label>
            <label>
              Card number
              <input required inputMode="numeric" placeholder="4242 4242 4242 4242" />
            </label>
            <div className="payment-row">
              <label>
                Expiry
                <input required placeholder="MM / YY" />
              </label>
              <label>
                CVC
                <input required inputMode="numeric" placeholder="123" />
              </label>
            </div>
            <button className="primary-btn auth-submit" disabled={busy}>
              {busy ? "Simulating payment..." : `Simulate $${price} payment`}
            </button>
          </form>
          <button className="back-link" onClick={() => navigate("pricing")}>
            Back to pricing
          </button>
        </section>
        <aside className="order-summary">
          <span>ORDER SUMMARY</span>
          <h2>{plan}</h2>
          <p>
            {plan === "Premium"
              ? "Deeper insight for active research."
              : "Unlimited, ad-free verification."}
          </p>
          <div>
            <span>Monthly subscription</span>
            <strong>${price}.00</strong>
          </div>
          <div className="order-total">
            <span>Total due today</span>
            <strong>${price}.00</strong>
          </div>
          <small>This is a simulation. No payment information is stored or processed.</small>
        </aside>
      </div>
    </main>
  );
}

function PaymentSuccess({ plan, navigate }: { plan: PaidPlan; navigate: (p: Page) => void }) {
  return (
    <main className="payment-success">
      <div>
        <span className="success-icon">
          <Icon name="check" size={27} />
        </span>
        <span className="simulation-badge">SIMULATION COMPLETE</span>
        <h1>Your {plan} preview is ready.</h1>
        <p>
          The simulated payment succeeded. No charge was made and your account plan was not changed.
        </p>
        <button className="primary-btn" onClick={() => navigate("verify")}>
          Continue to verification <Icon name="arrow" size={17} />
        </button>
      </div>
    </main>
  );
}

function Footer({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <Logo onClick={() => navigate("home")} />
          <p>
            Clearer information.
            <br />
            More informed decisions.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <strong>Product</strong>
            <button onClick={() => navigate("verify")}>Verify a claim</button>
            <button onClick={() => navigate("pricing")}>Pricing</button>
          </div>
          <div>
            <strong>Company</strong>
            <button onClick={() => navigate("about")}>About</button>
            <button onClick={() => navigate("contact")}>Contact</button>
          </div>
          <div>
            <strong>Legal</strong>
            <button onClick={() => navigate("privacy")}>Privacy policy</button>
            <button onClick={() => navigate("terms")}>Terms of use</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 Mingence. All rights reserved.</span>
        <span>Built for clarity and responsible use of AI.</span>
      </div>
    </footer>
  );
}

export default function App() {
  const initialPage = new URLSearchParams(window.location.search).get("page") as Page | null;
  const [page, setPage] = useState<Page>(initialPage ?? "home");
  const [claim, setClaim] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PaidPlan>("Premium");
  const navigate = (target: Page) => {
    setPage(target);
    const url = target === "home" ? window.location.pathname : `?page=${target}`;
    window.history.pushState({}, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session && (initialPage === "login" || initialPage === "register")) {
        setPage("results");
        window.history.replaceState({}, "", "?page=results");
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "PASSWORD_RECOVERY") setPage("reset-password");
      if (event === "SIGNED_IN") {
        setPage((current) => (current === "login" ? "results" : current));
      }
    });
    const onPopState = () => {
      const next = new URLSearchParams(window.location.search).get("page") as Page | null;
      setPage(next ?? "home");
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("popstate", onPopState);
    };
  }, []);
  const showHeader = ![
    "results",
    "login",
    "register",
    "forgot-password",
    "reset-password",
    "confirm-email",
    "payment",
    "payment-success",
  ].includes(page);
  return (
    <div className="app">
      {showHeader && <Header page={page} navigate={navigate} user={user} />}
      {page === "home" && <Home navigate={navigate} />}
      {page === "verify" && (
        <Verify
          initialClaim={claim}
          navigate={navigate}
          onComplete={(text) => {
            setClaim(text);
            navigate("results");
          }}
        />
      )}
      {page === "results" && (
        <Results
          navigate={navigate}
          onEdit={() => {
            if (!claim) {
              setClaim(
                "Global average sea level has risen by more than 20 centimetres since 1900.",
              );
            }
            navigate("verify");
          }}
        />
      )}
      {page === "pricing" && (
        <Pricing
          navigate={navigate}
          onChoose={(plan) => {
            setSelectedPlan(plan);
            navigate("payment");
          }}
        />
      )}
      {page === "login" && <Auth mode="login" navigate={navigate} />}
      {page === "register" && <Auth mode="register" navigate={navigate} />}
      {page === "forgot-password" && <SimpleAuthPage mode="forgot" navigate={navigate} />}
      {page === "reset-password" && <SimpleAuthPage mode="reset" navigate={navigate} />}
      {page === "confirm-email" && <EmailConfirmation navigate={navigate} />}
      {page === "profile" && <Profile user={user} navigate={navigate} />}
      {["about", "contact", "privacy", "terms"].includes(page) && (
        <InfoPage page={page} navigate={navigate} />
      )}
      {page === "payment" && <Payment plan={selectedPlan} navigate={navigate} />}
      {page === "payment-success" && <PaymentSuccess plan={selectedPlan} navigate={navigate} />}
    </div>
  );
}
