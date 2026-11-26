import { apiGet } from "../api/request/api";

export interface UserInfo {
    message: string;
    role: string;
}

export async function getUserInfo(
    accessToken: string
): Promise<UserInfo> {
    return apiGet<UserInfo>(
        "/getUserInfo",
        accessToken
    );
}