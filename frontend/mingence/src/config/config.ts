const requiredEnv = (value: string | undefined, name: string) => {
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
};

export const config = {
    apiBaseUrl: requiredEnv(
        import.meta.env.VITE_API_BASE_URL,
        "VITE_API_BASE_URL"
    ),

    supabase: {
        url: requiredEnv(
            import.meta.env.VITE_SUPABASE_URL,
            "VITE_SUPABASE_URL"
        ),

        publishableKey: requiredEnv(
            import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            "VITE_SUPABASE_PUBLISHABLE_KEY"
        ),
    },
};