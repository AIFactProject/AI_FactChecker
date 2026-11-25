
import { config } from "./config";

// Shared response handler
async function handleResponse<T>(
    response: Response
): Promise<T> {

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
            errorData?.detail ||
            `API Error: ${response.status} ${response.statusText}`
        );
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}


// GET Request
export async function apiGet<T>(
    endpoint: string,
    accessToken?: string
): Promise<T> {

    const headers = new Headers();

    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const response = await fetch(
        `${config.apiBaseUrl}${endpoint}`,
        {
            method: "GET",
            headers,
        }
    );

    return handleResponse<T>(response);
}


// POST Request
export async function apiPost<T>(
    endpoint: string,
    body: unknown,
    accessToken?: string
): Promise<T> {

    const headers = new Headers({
        "Content-Type": "application/json",
    });

    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const response = await fetch(
        `${config.apiBaseUrl}${endpoint}`,
        {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        }
    );

    return handleResponse<T>(response);
}
