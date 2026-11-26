
import uuid

from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from pydantic import BaseModel, Field

from userAuth import get_current_user
from userDB import connect_to_database
from encryption import encryption, decryption
from user import get_or_create_user_key

from analysisWorker import process_analysis


router = APIRouter(tags=["Analysis"])


# -----------------------------------------
# Request Models
# -----------------------------------------

class SubmitClaimRequest(BaseModel):
    claim: str = Field(min_length=1)
    field_id: uuid.UUID
    old_ref_id: Optional[uuid.UUID] = None


# -----------------------------------------
# Helper Functions
# -----------------------------------------

def get_user_id(current_user):
    """
    Retrieves the authenticated Supabase user ID.
    """

    if isinstance(current_user, dict):
        return str(current_user.get("id"))

    return str(current_user.id)


def delete_existing_claim(cursor, old_ref_id, user_id):

    # Verify ownership and lock the existing claim.
    cursor.execute(
        """
        SELECT id
        FROM public.input_claim
        WHERE id = %s
          AND user_id = %s
        FOR UPDATE
        """,
        (old_ref_id, user_id),
    )

    existing_claim = cursor.fetchone()

    if not existing_claim:
        raise HTTPException(
            status_code=404,
            detail="The referenced claim was not found."
        )

    # Delete associated evidence.
    cursor.execute(
        """
        DELETE FROM public.analysis_evidence
        WHERE analysis_point_id IN (
            SELECT ap.id
            FROM public.analysis_point ap
            JOIN public.analysis_claim ac
                ON ac.id = ap.analysis_claim_id
            WHERE ac.input_claim_id = %s
        )
        """,
        (old_ref_id,),
    )

    # Delete associated analysis points.
    cursor.execute(
        """
        DELETE FROM public.analysis_point
        WHERE analysis_claim_id IN (
            SELECT id
            FROM public.analysis_claim
            WHERE input_claim_id = %s
        )
        """,
        (old_ref_id,),
    )

    # Delete associated analysis status.
    cursor.execute(
        """
        DELETE FROM public.analysis_status
        WHERE input_claim_id = %s
        """,
        (old_ref_id,),
    )

    # Delete associated analysis claims.
    cursor.execute(
        """
        DELETE FROM public.analysis_claim
        WHERE input_claim_id = %s
        """,
        (old_ref_id,),
    )

    # Delete the original input claim.
    cursor.execute(
        """
        DELETE FROM public.input_claim
        WHERE id = %s
          AND user_id = %s
        """,
        (old_ref_id, user_id),
    )

@router.post("/submitClaim")
def submit_claim(
    request: SubmitClaimRequest,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
):

    user_id = get_user_id(current_user)

    article = request.claim.strip()

    if not article:
        raise HTTPException(
            status_code=400,
            detail="Claim cannot be empty."
        )

    try:
        # Retrieve the user's encrypted data key.
        encrypted_key = get_or_create_user_key(current_user)

        # Encrypt the article and its first 25 characters.
        encrypted_article = encryption(
            encrypted_key,
            article,
        )

        encrypted_brief = encryption(
            encrypted_key,
            article[:25],
        )

        with connect_to_database() as conn:
            with conn.cursor() as cursor:

                if request.old_ref_id is not None:
                    delete_existing_claim(
                        cursor,
                        request.old_ref_id,
                        user_id,
                    )

                cursor.execute(
                    """
                    INSERT INTO public.input_claim
                    (
                        id,
                        user_id,
                        field_id,
                        article,
                        article_brief,
                        submitted_date
                    )
                    VALUES (
                        gen_random_uuid(),
                        %s,
                        %s,
                        %s,
                        %s,
                        NOW()
                    )
                    RETURNING id
                    """,
                    (
                        user_id,
                        request.field_id,
                        encrypted_article,
                        encrypted_brief,
                    ),
                )

                input_claim_id = cursor.fetchone()[0]

                cursor.execute(
                    """
                    INSERT INTO public.analysis_claim
                    (
                        id,
                        input_claim_id,
                        generated_date
                    )
                    VALUES (
                        gen_random_uuid(),
                        %s,
                        NOW()
                    )
                    RETURNING id
                    """,
                    (input_claim_id,),
                )

                analysis_claim_id = cursor.fetchone()[0]

                cursor.execute(
                    """
                    INSERT INTO public.analysis_status
                    (
                        id,
                        input_claim_id,
                        status
                    )
                    VALUES (
                        gen_random_uuid(),
                        %s,
                        %s
                    )
                    """,
                    (
                        input_claim_id,
                        "Pending",
                    ),
                )

        # Start Background Processing
        background_tasks.add_task(
            process_analysis,
            analysis_claim_id,
            input_claim_id,
            encrypted_article,
            encrypted_key,
        )

        return {
            "message": "Claim submitted successfully.",
            "inputClaimId": str(input_claim_id),
            "analysisId": str(analysis_claim_id),
            "status": "Pending",
        }

    except HTTPException:
        raise

    except Exception as error:
        print(f"Submit claim error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Unable to submit the claim."
        )


@router.get("/getAnalysisStatus/{analysis_id}")
def get_analysis_status(
    analysis_id: uuid.UUID,
    current_user=Depends(get_current_user),
):

    user_id = get_user_id(current_user)

    try:
        with connect_to_database() as conn:
            with conn.cursor() as cursor:

                cursor.execute(
                    """
                    SELECT
                        ac.id,
                        ast.status
                    FROM public.analysis_claim ac
                    JOIN public.input_claim ic
                        ON ic.id = ac.input_claim_id
                    JOIN public.analysis_status ast
                        ON ast.input_claim_id = ic.id
                    WHERE ac.id = %s
                      AND ic.user_id = %s
                    """,
                    (
                        analysis_id,
                        user_id,
                    ),
                )

                result = cursor.fetchone()

                if not result:
                    raise HTTPException(
                        status_code=404,
                        detail="Analysis not found."
                    )

                return {
                    "analysisId": str(result[0]),
                    "status": result[1],
                }

    except HTTPException:
        raise

    except Exception as error:
        print(f"Get analysis status error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve analysis status."
        )

@router.get("/getAnalysis/{analysis_id}")
def get_analysis(
    analysis_id: uuid.UUID,
    current_user=Depends(get_current_user),
):
    
    user_id = get_user_id(current_user)

    try:
        # Retrieve the encrypted user key.
        encrypted_key = get_or_create_user_key(current_user)

        with connect_to_database() as conn:
            with conn.cursor() as cursor:

                # Retrieve the analysis and its status.
                cursor.execute(
                    """
                    SELECT
                        ac.id,
                        ac.summary,
                        ac.score,
                        ast.status
                    FROM public.analysis_claim ac
                    JOIN public.input_claim ic
                        ON ic.id = ac.input_claim_id
                    JOIN public.analysis_status ast
                        ON ast.input_claim_id = ic.id
                    WHERE ac.id = %s
                      AND ic.user_id = %s
                    """,
                    (
                        analysis_id,
                        user_id,
                    ),
                )

                analysis = cursor.fetchone()

                if not analysis:
                    raise HTTPException(
                        status_code=404,
                        detail="Analysis not found."
                    )

                analysis_id_db = analysis[0]
                encrypted_summary = analysis[1]
                score = analysis[2]
                status = analysis[3]

                if status != "Completed":
                    raise HTTPException(
                        status_code=409,
                        detail="Analysis has not completed."
                    )

                # Decrypt analysis summary.
                summary = decryption(
                    encrypted_key,
                    encrypted_summary,
                ) if encrypted_summary else None

                # Retrieve analysis points.
                cursor.execute(
                    """
                    SELECT
                        id,
                        point_text,
                        credibility
                    FROM public.analysis_point
                    WHERE analysis_claim_id = %s
                    ORDER BY id
                    """,
                    (analysis_id_db,),
                )

                point_rows = cursor.fetchall()

                points = []

                for point_id, encrypted_point, credibility in point_rows:

                    # Decrypt analysis point.
                    point_text = decryption(
                        encrypted_key,
                        encrypted_point,
                    )

                    # Retrieve supporting evidence.
                    cursor.execute(
                        """
                        SELECT
                            evidence_order,
                            evidence,
                            article_reference
                        FROM public.analysis_evidence
                        WHERE analysis_point_id = %s
                        ORDER BY evidence_order
                        """,
                        (point_id,),
                    )

                    evidence_rows = cursor.fetchall()

                    evidences = []

                    for (
                        evidence_order,
                        encrypted_evidence,
                        encrypted_reference,
                    ) in evidence_rows:

                        evidences.append({
                            "evidenceOrder": evidence_order,

                            "evidence": decryption(
                                encrypted_key,
                                encrypted_evidence,
                            ),

                            "articleReference": (
                                decryption(
                                    encrypted_key,
                                    encrypted_reference,
                                )
                                if encrypted_reference
                                else None
                            ),
                        })

                    points.append({
                        "point": point_text,
                        "credibility": credibility,
                        "evidences": evidences,
                    })

                return {
                    "analysisId": str(analysis_id_db),
                    "status": status,
                    "summary": summary,
                    "trustScore": score,
                    "points": points,
                }

    except HTTPException:
        raise

    except Exception as error:
        print(f"Get analysis error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve analysis."
        )
