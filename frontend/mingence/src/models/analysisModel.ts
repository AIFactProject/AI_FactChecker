export type AnalysisStatus =
    | "Pending"
    | "Processing Claim"
    | "Gathering Evidences"
    | "Formating Analysis"
    | "Completed"
    | "Failed";

export interface SubmitClaimRequest {
    claim: string;
    field_id: string;
    old_ref_id?: string | null;
}

export interface SubmitClaimResponse {
    message: string;
    inputClaimId: string;
    analysisId: string;
    status: AnalysisStatus;
}

export interface AnalysisStatusResponse {
    analysisId: string;
    status: AnalysisStatus;
}

export interface AnalysisEvidence {
    evidenceOrder: number;
    evidence: string;
    articleReference: string | null;
}

export interface AnalysisPoint {
    point: string;
    credibility: "Trusted" | "Misinformation";
    evidences: AnalysisEvidence[];
}

export interface AnalysisResponse {
    analysisId: string;
    status: "Completed";
    summary: string;
    trustScore: number | null;
    points: AnalysisPoint[];
}