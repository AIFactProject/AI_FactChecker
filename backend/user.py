import logging

from fastapi import HTTPException
from psycopg.rows import dict_row
from encryption import generateUserKey

from userDB import connect_to_database


def get_or_create_user_key(current_user):
    user_id = str(current_user.id)

    with connect_to_database() as conn:
        with conn.cursor(row_factory=dict_row) as cursor:

            # Prevent duplicate key creation for the same user.
            cursor.execute(
                """
                SELECT pg_advisory_xact_lock(
                    hashtextextended(%s, 0)
                )
                """,
                (f"user-key:{user_id}",)
            )

            # Retrieve existing user key.
            cursor.execute(
                """
                SELECT
                    id,
                    user_id,
                    key
                FROM public.user_key
                WHERE user_id = %s
                LIMIT 1
                """,
                (user_id,)
            )

            user_key = cursor.fetchone()

            if user_key:
                return user_key["key"]

            # Generate a new encrypted user key.
            encrypted_key = generateUserKey()

            cursor.execute(
                """
                INSERT INTO public.user_key (
                    user_id,
                    key
                )
                VALUES (%s, %s)
                RETURNING id, user_id, key
                """,
                (user_id, encrypted_key)
            )

            new_user_key = cursor.fetchone()

            return new_user_key["key"]



def get_or_create_user_role(current_user):

    user_id = str(current_user.id)

    try:
        with connect_to_database() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:

                # Prevent concurrent creation of duplicate roles.
                cursor.execute(
                    """
                    SELECT pg_advisory_xact_lock(
                        hashtextextended(%s, 0)
                    )
                    """,
                    (f"user-role:{user_id}",)
                )

                # Retrieve the latest active analysis role.
                cursor.execute(
                    """
                    SELECT
                        ar.*
                    FROM public.user_role AS ur
                    INNER JOIN public.analysis_role AS ar
                        ON ar.id = ur.analysis_role_id
                    WHERE ur.user_id = %s
                      AND ur.start_date <= CURRENT_TIMESTAMP
                      AND (
                          ur.end_date IS NULL
                          OR ur.end_date > CURRENT_TIMESTAMP
                      )
                    ORDER BY
                        ur.start_date DESC,
                        ur.id DESC
                    LIMIT 1
                    """,
                    (user_id,)
                )

                analysis_role = cursor.fetchone()

                # Return the existing analysis role.
                if analysis_role is not None:
                    return analysis_role

                # Retrieve the default analysis role.
                cursor.execute(
                    """
                    SELECT *
                    FROM public.analysis_role
                    WHERE is_default IS TRUE
                    LIMIT 2
                    """
                )

                default_roles = cursor.fetchall()

                if len(default_roles) != 1:
                    raise HTTPException(
                        status_code=500,
                        detail=(
                            "Default analysis role is missing "
                            "or incorrectly configured."
                        )
                    )

                default_role = default_roles[0]

                # Create a new UserRole using the default role.
                cursor.execute(
                    """
                    INSERT INTO public.user_role (
                        user_id,
                        analysis_role_id,
                        start_date
                    )
                    VALUES (
                        %s,
                        %s,
                        CURRENT_TIMESTAMP
                    )
                    """,
                    (
                        user_id,
                        default_role["id"]
                    )
                )

                # Return the newly assigned analysis role.
                return default_role

    except HTTPException:
        raise

    except Exception as error:
        logging.exception(
            "Failed to retrieve or create UserRole."
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve user analysis role."
        ) from error
