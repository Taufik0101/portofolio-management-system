import { supabase } from "./supabase";

export interface SignInResult {
    success: boolean;
    error?: string;
}

export async function signIn(
    email: string,
    password: string
): Promise<SignInResult> {
    if (!supabase) {
        return {
            success: false,
            error: "Supabase client is not initialized",
        };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return {
            success: false,
            error: error.message,
        };
    }

    return {
        success: true,
    };
}

export async function signOut(): Promise<void> {
    if (!supabase) {
        throw new Error("Supabase client is not initialized");
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
        throw error;
    }
}

export async function getCurrentUser() {
    if (!supabase) {
        return null;
    }

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) {
        return null;
    }

    return user;
}