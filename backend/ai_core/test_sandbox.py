from schemas import Citation, VerificationOutput
from mock_retriever import mock_retrieve_evidence


def run_sandbox_test():
    test_claim = "High-dose Vitamin D prevents COVID-19 infection."
    test_entities = ["Vitamin D", "COVID-19"]

    # 1. Simulate receiving chunks from Person 1
    chunks = mock_retrieve_evidence(claim=test_claim, entities=test_entities, top_k=5)
    print(f"Retrieved {len(chunks)} chunks. Top chunk ID: {chunks[0].chunk_id}\n")

    # 2. Simulate producing the final structured output for Person 3
    sample_output = VerificationOutput(
        claim=test_claim,
        verdict="REFUTED",
        confidence_score=0.89,
        nli_probabilities={
            "SUPPORTS": 0.03,
            "REFUTES": 0.89,
            "NOT_ENOUGH_INFO": 0.08,
        },
        general_summary=(
            "Large clinical trials show that taking high-dose Vitamin D supplements does not prevent "
            "COVID-19 infection. While maintaining healthy Vitamin D levels supports overall health, "
            "excessively high doses will not protect against the virus and can cause toxicity."
        ),
        clinical_explanation=(
            "Phase 3 randomized controlled trials (CORONAVIT, n=6,200; Norwegian trial, n=34,601) found no "
            "statistically significant reduction in SARS-CoV-2 incidence from Vitamin D supplementation [pmid_36070894_c1]. "
            "A JAMA RCT administering a single 200,000 IU bolus also failed to improve clinical outcomes [pmid_33595634_c1]. "
            "WHO and NIH guidelines advise against high-dose supplementation for COVID-19 prevention due to hypercalcemia risks [who_nih_vitd_g1]."
        ),
        citations=[
            Citation(
                chunk_id=chunks[0].chunk_id,
                source_org=chunks[0].source_org,
                url=chunks[0].url,
                quoted_passage="not associated with a reduction in the risk of all-cause acute respiratory tract infection or swab-test-confirmed COVID-19",
            ),
            Citation(
                chunk_id=chunks[3].chunk_id,
                source_org=chunks[3].source_org,
                url=chunks[3].url,
                quoted_passage="insufficient evidence to recommend either for or against the use of vitamin D for the prevention or treatment of COVID-19",
            ),
        ],
    )

    # 3. Serialize to JSON (this is the exact payload Person 3's FastAPI will return)
    print("--- Validated VerificationOutput JSON ---")
    print(sample_output.model_dump_json(indent=2))


if __name__ == "__main__":
    run_sandbox_test()