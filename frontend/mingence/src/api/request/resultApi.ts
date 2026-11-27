import { apiGet, apiPost } from "./api";
import { getAccessToken } from "../supabase/supabaseAuth";
import type { ClaimHistoryResponse, ClaimItem } from "../../models/resultModel"


export async function getClaimHistory(
): Promise<ClaimHistoryResponse> {

    const accessToken = await getAccessToken();

    return apiGet<ClaimHistoryResponse>(
        `/getClaimHistory`,
        accessToken
    );
}


export async function removeClaim(
    analysisId: string
): Promise<void> {

    const accessToken = await getAccessToken();

    return apiPost<void>(
        `/removeClaim`,
        {
            analysis_id: analysisId
        },
        accessToken
    );
}


export async function getClaimArticle(
    analysisId: string
): Promise<ClaimItem> {

    const accessToken = await getAccessToken();

    return apiGet<ClaimItem>(
        `/getClaimArticle/${encodeURIComponent(analysisId)}`,
        accessToken
    );
}