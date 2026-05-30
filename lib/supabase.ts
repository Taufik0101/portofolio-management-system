import { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase configuration is missing. NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.");
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabase: SupabaseClient | null = createSupabaseBrowserClient();

export async function uploadImage(file: File): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized");
  }

  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `portfolio-images/${fileName}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("portfolio-images")
    .upload(filePath, buffer, {
      contentType: file.type,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage
    .from("portfolio-images")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
