from typing import List, Optional
from schemas import EvidenceChunk

MOCK_VITAMIN_D_CHUNKS: List[EvidenceChunk] = [
    EvidenceChunk(
        chunk_id="pmid_36070894_c1",
        text=(
            "In the CORONAVIT phase 3 randomized controlled trial involving 6,200 UK adults, "
            "implementation of a test-and-treat approach to vitamin D supplementation (800 IU/day or 3,200 IU/day) "
            "over six months was not associated with a reduction in the risk of all-cause acute respiratory "
            "tract infection or swab-test-confirmed COVID-19 compared with no offer of supplementation."
        ),
        source_org="PubMed / BMJ",
        url="https://pubmed.ncbi.nlm.nih.gov/36070894/",
        pub_date="2022-09",
        study_type="Randomized Controlled Trial",
        hybrid_score=0.94,
    ),
    EvidenceChunk(
        chunk_id="pmid_36070895_c1",
        text=(
            "A large quadruple-blinded randomized placebo-controlled trial in Norway with 34,601 adults "
            "evaluated daily supplementation with cod liver oil (containing 400 IU vitamin D) for up to six months. "
            "Supplementation did not reduce the incidence of SARS-CoV-2 infection, serious COVID-19, "
            "or other acute respiratory infections compared with placebo."
        ),
        source_org="PubMed / BMJ",
        url="https://pubmed.ncbi.nlm.nih.gov/36070895/",
        pub_date="2022-09",
        study_type="Randomized Controlled Trial",
        hybrid_score=0.91,
    ),
    EvidenceChunk(
        chunk_id="pmid_33595634_c1",
        text=(
            "In a multicenter, double-blind, randomized, placebo-controlled trial of 240 hospitalized patients "
            "with moderate to severe COVID-19, administration of a single high oral dose of 200,000 IU of vitamin D3 "
            "significantly increased serum 25-hydroxyvitamin D levels but did not significantly reduce hospital "
            "length of stay, mortality, or ICU admission compared with placebo."
        ),
        source_org="PubMed / JAMA",
        url="https://pubmed.ncbi.nlm.nih.gov/33595634/",
        pub_date="2021-02",
        study_type="Randomized Controlled Trial",
        hybrid_score=0.88,
    ),
    EvidenceChunk(
        chunk_id="who_nih_vitd_g1",
        text=(
            "Current public health and clinical treatment guidelines from the WHO and NIH state that there is "
            "insufficient evidence to recommend either for or against the use of vitamin D for the prevention "
            "or treatment of COVID-19. Taking excessively high doses of vitamin D above the tolerable upper intake "
            "level (4,000 IU/day for adults) can cause vitamin D toxicity and hypercalcemia."
        ),
        source_org="WHO / NIH Clinical Guidelines",
        url="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters",
        pub_date="2023-06",
        study_type="Public Guideline",
        hybrid_score=0.85,
    ),
    EvidenceChunk(
        chunk_id="pmid_34029377_c1",
        text=(
            "Several observational studies have reported an association between low baseline serum vitamin D "
            "levels and higher rates of SARS-CoV-2 positivity or severe illness. However, observational data "
            "cannot establish causality due to confounding factors such as age, obesity, and underlying chronic illness, "
            "and do not demonstrate that high-dose supplementation prevents infection in the general population."
        ),
        source_org="PubMed / Cochrane Review",
        url="https://pubmed.ncbi.nlm.nih.gov/34029377/",
        pub_date="2021-05",
        study_type="Systematic Review",
        hybrid_score=0.79,
    ),
]


def mock_retrieve_evidence(
    claim: str,
    entities: Optional[List[str]] = None,
    top_k: int = 5,
) -> List[EvidenceChunk]:
    """
    Simulates Person 1's hybrid retriever so Person 2 can build and test independently.
    When Person 1 finishes Part 1, swap this function call with Person 1's real retriever.
    """
    print(f"[Mock Retriever] Searching for claim: '{claim}' | Entities: {entities}")
    return MOCK_VITAMIN_D_CHUNKS[:top_k]