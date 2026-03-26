import { supabase } from "@/lib/adapters/supabase.client";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

async function authHeaders(): Promise<HeadersInit> {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
        "Content-Type": "application/json",
        ...(await authHeaders()),
        ...(options.headers ?? {}),
    };
    return fetch(`${API_BASE}${path}`, { ...options, headers });
}
