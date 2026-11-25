import type { Page } from "./types";
import { Logo } from "./Logo";
export function Footer({ navigate }: { navigate: (p: Page) => void }) {
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
