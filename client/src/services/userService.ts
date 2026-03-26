import { supabase } from "@/lib/adapters/supabase.client";
import { apiFetch } from "@/lib/api";
import { ProfileProps } from "@/types/user";

const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error("Sign up failed");

    const res = await apiFetch("/api/users/", {
        method: "POST",
        body: JSON.stringify({ username, email }),
    });
    if (!res.ok) throw new Error("Failed to create user profile");

    return data.user;
};

const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
};

const logout = async () => {
    await supabase.auth.signOut();
};

const getCurrentUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
};

const getUser = async (): Promise<ProfileProps | null> => {
    try {
        const res = await apiFetch("/api/users/me");
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
};

const updateUser = async (username: string): Promise<boolean> => {
    try {
        const res = await apiFetch("/api/users/me", {
            method: "PATCH",
            body: JSON.stringify({ username }),
        });
        return res.ok;
    } catch {
        return false;
    }
};

const deleteUser = async (): Promise<boolean> => {
    try {
        const res = await apiFetch("/api/users/me", { method: "DELETE" });
        if (res.ok) await supabase.auth.signOut();
        return res.ok;
    } catch {
        return false;
    }
};

export { signUp, login, logout, getCurrentUser, getUser, updateUser, deleteUser };
