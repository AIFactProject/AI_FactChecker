
import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from userAuth import get_current_user
from userDB import connect_to_database
from encryption import decryption
from user import get_or_create_user_key
from analysis import delete_existing_claim


router = APIRouter(tags=["Result"])

@router.get("/getClaimHistory")
def get_results(
    current_user=Depends(get_current_user),
):
    
    try:
        user_id = str(current_user.id)
        # Retrieve the encrypted user key.
        encrypted_key = get_or_create_user_key(current_user)

        with connect_to_database() as conn:
            with conn.cursor() as cursor:

                cursor.execute(
                    """
                    SELECT
                        ic.id,
                        ic.article_brief,
                        COALESCE(
                            ac.generated_date,
                            ic.submitted_date
                        ) AS submit_time,
                        COALESCE(ac.score, 0.0) AS score,
                        COALESCE(point_counts.point_count, 0)
                            AS point_count
                    FROM public.input_claim ic
                    LEFT JOIN public.analysis_claim ac
                        ON ac.input_claim_id = ic.id
                    LEFT JOIN LATERAL (
                        SELECT COUNT(*) AS point_count
                        FROM public.analysis_point ap
                        WHERE ap.analysis_claim_id = ac.id
                    ) point_counts ON TRUE
                    WHERE ic.user_id = %s
                    ORDER BY
                        COALESCE(
                            ac.generated_date,
                            ic.submitted_date
                        ) DESC,
                        ic.id DESC
                    """,
                    (user_id,)
                )

                rows = cursor.fetchall()

                claims = []

                for row in rows:
                    claims.append({
                        "id": str(row[0]),
                        "article_brief": decryption(
                            encrypted_key,
                            row[1]
                        ) + "...",
                        "submit_time": row[2],
                        "score": row[3],
                        "point_count": row[4]
                    })

                return {
                    "claims": claims
                }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve results: {str(e)}"
        )

class RemoveClaimRequest(BaseModel):
    analysis_id: uuid.UUID

@router.post("/removeClaim")
def get_results(
    analysis: RemoveClaimRequest,
    current_user=Depends(get_current_user),
):
    
    try:
        user_id = str(current_user.id)
                
        with connect_to_database() as conn:
            with conn.cursor() as cursor:
                delete_existing_claim(
                    cursor,
                    analysis.analysis_id,
                    user_id,
                )

                return

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve results: {str(e)}"
        )


@router.get("/getClaimArticle/{analysis_id}")
def get_analysis(
    analysis_id: uuid.UUID,
    current_user=Depends(get_current_user),
):

    try:
        user_id = str(current_user.id)

        # Retrieve the encrypted user key.
        encrypted_key = get_or_create_user_key(current_user)

        with connect_to_database() as conn:
            with conn.cursor() as cursor:

                # Retrieve the analysis and its status.
                cursor.execute(
                    """
                    SELECT
                        ic.article
                    FROM public.input_claim ic
                    WHERE ic.id = %s
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

                encrypted_article = analysis[0]

                # Decrypt analysis summary.
                article = decryption(
                    encrypted_key,
                    encrypted_article,
                )
                
                return {
                    "article": article,
                }

    except HTTPException:
        raise

    except Exception as error:
        print(f"Get claim article error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve article."
        )
