import { User as SupabaseUser } from "@supabase/supabase-js";

export type UserProps = {
    id: string;
    username: string;
    email: string;
    created_at: string;
    updated_at: string;
};

export type ProfileProps = {
    id: string;
    username: string;
    email: string;
};

export type User = SupabaseUser | null;
