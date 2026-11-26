
import { apiGet, apiPost } from "./api";
import { getAccessToken } from "../supabase/supabaseAuth";
import type { SubmitClaimRequest, SubmitClaimResponse, AnalysisResponse, AnalysisStatusResponse } from "../../models/analysisModel"

export async function submitClaim(
    request: SubmitClaimRequest
): Promise<SubmitClaimResponse> {

    const accessToken = await getAccessToken();

    return apiPost<SubmitClaimResponse>(
        "/submitClaim",
        {
            claim: request.claim,
            field_id: request.field_id,
            old_ref_id: request.old_ref_id ?? null,
        },
        accessToken
    );
}

export async function getAnalysisStatus(
    analysisId: string
): Promise<AnalysisStatusResponse> {

    const accessToken = await getAccessToken();

    return apiGet<AnalysisStatusResponse>(
        `/getAnalysisStatus/${encodeURIComponent(analysisId)}`,
        accessToken
    );
}

export async function getAnalysis(
    analysisId: string
): Promise<AnalysisResponse> {

    const accessToken = await getAccessToken();

    return apiGet<AnalysisResponse>(
        `/getAnalysis/${encodeURIComponent(analysisId)}`,
        accessToken
    );
}