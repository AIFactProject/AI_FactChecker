export interface ClaimHistoryItem {
    id: string;
    article_brief: string;
    submit_time: string;
    score: number;
    point_count: number;
}

export interface ClaimHistoryResponse {
    claims: ClaimHistoryItem[];
}

export type ScoreTone = "gray" | "red" | "amber" | "green";

export interface HistoryItem extends ClaimHistoryItem  {
    meta: string;
    tone: ScoreTone;
    day: string;
}

export interface ClaimItem {
    article: string
}