from typing import Dict, List, Literal
from pydantic import BaseModel, Field


class EvidenceChunk(BaseModel):
    """Contract 1: What Person 1 (Data & Retrieval) hands to Person 2."""
    chunk_id: str = Field(..., description="Unique identifier for the text chunk (e.g., pmid_36070894_c1).")
    text: str = Field(..., description="The actual passage of evidence retrieved from the source.")
    source_org: str = Field(..., description="Publishing organization or database (e.g., PubMed, WHO, BMJ, JAMA).")
    url: str = Field(..., description="Direct link to the original study or guideline.")
    pub_date: str = Field(..., description="Publication date in YYYY-MM or YYYY-MM-DD format.")
    study_type: str = Field(..., description="Evidence tier (e.g., RCT, Meta-Analysis, Public Guideline, Observational).")
    hybrid_score: float = Field(..., ge=0.0, le=1.0, description="Combined Dense + BM25 retrieval score (0.0 to 1.0).")


class Citation(BaseModel):
    """Structured reference linking a claim explanation back to an exact EvidenceChunk."""
    chunk_id: str = Field(..., description="Must match a chunk_id from the retrieved EvidenceChunk list.")
    source_org: str = Field(..., description="Organization that published the cited evidence.")
    url: str = Field(..., description="Direct URL for the user to inspect the source.")
    quoted_passage: str = Field(..., description="Short, exact supporting quote from the chunk.")


class VerificationOutput(BaseModel):
    """Contract 2: What Person 2 (AI Core) hands to Person 3 (FastAPI / React UI)."""
    claim: str = Field(..., description="The atomic factual claim that was verified.")
    verdict: Literal["SUPPORTED", "REFUTED", "MISLEADING", "INCONCLUSIVE"] = Field(
        ..., description="Final categorical assessment grounded in retrieved evidence."
    )
    confidence_score: float = Field(
        ..., ge=0.0, le=1.0, description="Calibrated confidence score (0.0 to 1.0) derived from NLI and reranking."
    )
    nli_probabilities: Dict[str, float] = Field(
        ..., description="Softmax probability breakdown: {'SUPPORTS': float, 'REFUTES': float, 'NOT_ENOUGH_INFO': float}."
    )
    general_summary: str = Field(
        ..., description="Plain-language explanation tailored for everyday users."
    )
    clinical_explanation: str = Field(
        ..., description="Detailed technical synthesis (methodology, sample sizes, nuances) for researchers and journalists."
    )
    citations: List[Citation] = Field(
        default_factory=list, description="List of verified source citations backing the explanations."
    )