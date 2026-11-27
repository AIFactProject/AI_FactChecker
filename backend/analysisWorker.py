
import random
import re
import time

from userDB import connect_to_database
from encryption import encryption, decryption


# -----------------------------------------
# Temporary Mock Evidence
# -----------------------------------------

LOREM_EVIDENCES = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa.",
    "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.",
    "Nullam varius, turpis et commodo pharetra, est eros bibendum elit.",
    "Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue.",
    "Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor.",
    "Integer vitae libero ac risus egestas placerat.",
]


# -----------------------------------------
# 1. Update Analysis Status
# -----------------------------------------

def update_analysis_status(input_claim_id, status):
    """
    Updates the status associated with an InputClaim.

    AnalysisStatus uses input_claim_id as its foreign key.
    """

    with connect_to_database() as conn:
        with conn.cursor() as cursor:

            cursor.execute(
                """
                UPDATE public.analysis_status
                SET status = %s
                WHERE input_claim_id = %s
                """,
                (
                    status,
                    input_claim_id,
                ),
            )

            if cursor.rowcount == 0:
                raise ValueError(
                    f"Analysis status not found for InputClaim "
                    f"{input_claim_id}"
                )


# -----------------------------------------
# 2. Generate Temporary Analysis Points
# -----------------------------------------

def generate_test_points(article):
    """
    Randomly selects 2-3 sentences from the submitted article.

    Each selected sentence receives 4-5 mock evidence entries.
    """

    sentences = re.split(
        r"(?<=[.!?])\s+",
        article.strip(),
    )

    sentences = [
        sentence.strip()
        for sentence in sentences
        if sentence.strip()
    ]

    if not sentences:
        raise ValueError(
            "The submitted article contains no sentences."
        )

    number_of_points = min(
        random.randint(2, 3),
        len(sentences),
    )

    selected_sentences = random.sample(
        sentences,
        number_of_points,
    )

    points = []

    for sentence in selected_sentences:

        number_of_evidences = random.randint(4, 5)

        selected_evidences = random.sample(
            LOREM_EVIDENCES,
            number_of_evidences,
        )

        evidences = []

        for index, evidence in enumerate(
            selected_evidences,
            start=1,
        ):

            evidences.append({
                "evidenceOrder": index,
                "evidence": evidence,
                "articleReference": (
                    f"https://example.com/test-evidence/"
                    f"{random.randint(1000, 9999)}"
                ),
            })

        points.append({
            "point": sentence,

            "credibility": random.choice([
                "Trusted",
                "Misinformation",
            ]),

            "evidences": evidences,
        })

    return points


# -----------------------------------------
# 3. Mock Verification
# -----------------------------------------

def verify_claim(article):
    """
    Temporary mock verification function.

    Replace this function with the actual Mingence
    fact-verification and evidence retrieval workflow later.
    """

    points = generate_test_points(article)

    return {
        "summary": (
            "This is a temporary mock analysis generated "
            "for testing the Mingence processing workflow."
        ),

        "trustScore": random.randint(60, 95)/100.0,

        "points": points,
    }


# -----------------------------------------
# 4. Save Analysis Result
# -----------------------------------------

def save_analysis_result(
    analysis_claim_id,
    encrypted_key,
    result,
):
    """
    Saves the analysis summary, score, points and evidence.

    All text content is encrypted before database insertion.
    """

    encrypted_summary = encryption(
        encrypted_key,
        result["summary"],
    )

    with connect_to_database() as conn:
        with conn.cursor() as cursor:

            # Update AnalysisClaim.
            cursor.execute(
                """
                UPDATE public.analysis_claim
                SET
                    summary = %s,
                    score = %s,
                    generated_date = NOW()
                WHERE id = %s
                """,
                (
                    encrypted_summary,
                    result["trustScore"],
                    analysis_claim_id,
                ),
            )

            if cursor.rowcount == 0:
                raise ValueError(
                    f"AnalysisClaim {analysis_claim_id} no longer exists."
                )

            # Insert AnalysisPoint records.
            for point in result["points"]:

                encrypted_point = encryption(
                    encrypted_key,
                    point["point"],
                )

                cursor.execute(
                    """
                    INSERT INTO public.analysis_point
                    (
                        id,
                        analysis_claim_id,
                        point_text,
                        credibility
                    )
                    VALUES (
                        gen_random_uuid(),
                        %s,
                        %s,
                        %s
                    )
                    RETURNING id
                    """,
                    (
                        analysis_claim_id,
                        encrypted_point,
                        point["credibility"],
                    ),
                )

                point_id = cursor.fetchone()[0]

                # Insert AnalysisEvidence records.
                for evidence in point["evidences"]:

                    encrypted_evidence = encryption(
                        encrypted_key,
                        evidence["evidence"],
                    )

                    encrypted_reference = encryption(
                        encrypted_key,
                        evidence["articleReference"],
                    )

                    cursor.execute(
                        """
                        INSERT INTO public.analysis_evidence
                        (
                            id,
                            analysis_point_id,
                            evidence_order,
                            evidence,
                            article_reference
                        )
                        VALUES (
                            gen_random_uuid(),
                            %s,
                            %s,
                            %s,
                            %s
                        )
                        """,
                        (
                            point_id,
                            evidence["evidenceOrder"],
                            encrypted_evidence,
                            encrypted_reference,
                        ),
                    )


# -----------------------------------------
# 5. Process Analysis
# -----------------------------------------

def process_analysis(
    analysis_claim_id,
    input_claim_id,
    encrypted_article,
    encrypted_key,
):
    """
    Background analysis workflow.

    Status sequence:

        Pending
            |
        Processing Claim
            |
        Gathering Evidences
            |
        Formating Analysis
            |
        Completed

    Each processing stage waits for a random 2-4 seconds.
    """

    try:

        # -----------------------------------------
        # Stage 1: Processing Claim
        # -----------------------------------------

        update_analysis_status(
            input_claim_id,
            "Processing Claim",
        )

        time.sleep(random.uniform(2, 4))

        # Decrypt submitted article.
        article = decryption(
            encrypted_key,
            encrypted_article,
        )

        # -----------------------------------------
        # Stage 2: Gathering Evidences
        # -----------------------------------------

        update_analysis_status(
            input_claim_id,
            "Gathering Evidences",
        )

        time.sleep(random.uniform(2, 4))

        # Generate temporary mock analysis.
        result = verify_claim(article)

        # -----------------------------------------
        # Stage 3: Formating Analysis
        # -----------------------------------------

        update_analysis_status(
            input_claim_id,
            "Formating Analysis",
        )

        time.sleep(random.uniform(2, 4))

        # Save summary, score, points and evidence.
        save_analysis_result(
            analysis_claim_id,
            encrypted_key,
            result,
        )

        # -----------------------------------------
        # Stage 4: Completed
        # -----------------------------------------

        update_analysis_status(
            input_claim_id,
            "Completed",
        )

    except Exception as error:

        print(
            f"Analysis worker error for "
            f"InputClaim {input_claim_id}: {error}"
        )

        try:
            update_analysis_status(
                input_claim_id,
                "Failed",
            )

        except Exception as status_error:

            print(
                f"Unable to update failed status: "
                f"{status_error}"
            )
