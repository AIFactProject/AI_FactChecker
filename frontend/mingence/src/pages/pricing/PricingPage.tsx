import type { Page, PaidPlan } from "../../common/types";
import { Icon } from "../../common/Icon";
import { plans } from "../../common/plans";
export function PricingPage({
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
