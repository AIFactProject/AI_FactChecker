import { useEffect, useState } from "react";
import { Icon } from "./Icon";
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

export function AdSidebar({ compact = false }: { compact?: boolean }) {
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
