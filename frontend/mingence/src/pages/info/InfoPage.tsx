import type { Page } from "../../common/types";
import { ContentPage } from "../../common/ContentPage";
export function InfoPage({ page, navigate }: { page: Page; navigate: (p: Page) => void }) {
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
          <a href="mailto:mingence.services@gmail.com">mingence.services@gmail.com</a>
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
        {/*
        <h2>Account deletion</h2>
        <p>
          Soft-deleted accounts have identifying details replaced with non-reversible hashes and can
          no longer be accessed.
        </p>
        */}
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
