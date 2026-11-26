import { useEffect, useState } from "react";
import type { Page } from "../../common/types";
import { Icon } from "../../common/Icon";
import { AdSidebar } from "../../common/AdSidebar";
import { HistorySidebar } from "../../common/HistorySidebar";

import { submitClaim, getAnalysisStatus, getAnalysis,} from "../../api/request/analysisApi";
import type { AnalysisStatus } from "../../models/analysisModel";

const STATUS_PROGRESS: Record<AnalysisStatus, number> = {
  "Pending": 5,
  "Processing Claim": 25,
  "Gathering Evidences": 55,
  "Formating Analysis": 80,
  "Completed": 100,
  "Failed": 0,
};

const STATUS_LABELS: Record<AnalysisStatus, string> = {
  "Pending": "Waiting for analysis...",
  "Processing Claim": "Identifying claims...",
  "Gathering Evidences": "Retrieving trusted evidence...",
  "Formating Analysis": "Preparing your assessment...",
  "Completed": "Analysis completed!",
  "Failed": "Analysis failed.",
};

const delay = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export function VerifyPage({
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
  const [currentStatus, setCurrentStatus] =
    useState<AnalysisStatus>("Pending");

  const handleAnalyse = async () => {
    if (!text.trim() || processing) return;

    setProcessing(true);
    setProgress(STATUS_PROGRESS["Pending"]);
    setCurrentStatus("Pending");

    try {
      // 1. Submit the claim to the backend.
      const submission = await submitClaim({
        claim: text.trim(),
        field_id: "0a0639a0-7be6-4778-a584-85097bcae3b7",
      });

      const analysisId = submission.analysisId;

      console.log("Analysis submitted:", submission);

      // 2. Wait until the backend reports Completed or Failed.
      while (true) {
        await delay(2000);

        const statusResult = await getAnalysisStatus(analysisId);
        const status = statusResult.status;

        setCurrentStatus(status);
        setProgress(STATUS_PROGRESS[status]);

        console.log("Analysis status:", status);

        // 3. Stop polling when the analysis is completed.
        if (status === "Completed") {
          const result = await getAnalysis(analysisId);

          // 4. Print the completed analysis result.
          console.log("Analysis result:", result);

          onComplete(text.trim());
          break;
        }

        // 5. Stop polling when the analysis fails.
        if (status === "Failed") {
          console.error("Analysis failed:", analysisId);
          break;
        }
      }
    } catch (error) {
      console.error("Error during analysis:", error);
    } finally {
      setProcessing(false);
    }
  };

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
                maxLength={1500}
                placeholder="e.g. Global sea levels have risen by more than 20 cm since 1900."
                disabled={processing}
              />
              <span>{text.length} / 1500</span>
            </div>
            <div className="verify-footer">
              <p>
                <Icon name="shield" size={17} /> Your submission is private and handled securely.
              </p>
              <button
                className="primary-btn"
                disabled={!text.trim() || processing}
                onClick={handleAnalyse}
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
                  
                  <Icon name="sparkles" size={17} />
                  {STATUS_LABELS[currentStatus]}

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
