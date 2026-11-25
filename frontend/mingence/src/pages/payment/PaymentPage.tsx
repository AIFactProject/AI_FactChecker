import { useState } from "react";
import type { FormEvent } from "react";
import type { Page, PaidPlan } from "../../common/types";
import { Icon } from "../../common/Icon";
export function PaymentPage({ plan, navigate }: { plan: PaidPlan; navigate: (p: Page) => void }) {
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

export function PaymentSuccess({ plan, navigate }: { plan: PaidPlan; navigate: (p: Page) => void }) {
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
