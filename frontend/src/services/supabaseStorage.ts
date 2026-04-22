import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const bucketName = (import.meta.env.VITE_SUPABASE_BUCKET as string) || "menu-images";

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const uploadMenuImage = async (file: File): Promise<{ path: string; publicUrl: string }> => {
  if (!supabase) {
    throw new Error("Missing Supabase env values: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
  }
  const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const filePath = `items/${uniqueFileName}`;

  const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false
  });
  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return { path: filePath, publicUrl: data.publicUrl };
};

export const removeMenuImage = async (path: string): Promise<void> => {
  if (!supabase) {
    throw new Error("Missing Supabase env values: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
  }
  const { error } = await supabase.storage.from(bucketName).remove([path]);
  if (error) {
    throw new Error(error.message);
  }
};

export const getStoragePathFromPublicUrl = (publicUrl: string): string | null => {
  const marker = `/object/public/${bucketName}/`;
  const markerIndex = publicUrl.indexOf(marker);
  if (markerIndex === -1) return null;
  return publicUrl.substring(markerIndex + marker.length);
};
