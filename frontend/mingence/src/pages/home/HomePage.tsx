import type { Page } from "../../common/types";
import { Icon } from "../../common/Icon";
import type { IconName } from "../../common/Icon";
import { AdSidebar } from "../../common/AdSidebar";
import { Footer } from "../../common/Footer";
import { plans } from "../../common/plans";
export function HomePage({ navigate }: { navigate: (p: Page) => void }) {
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
