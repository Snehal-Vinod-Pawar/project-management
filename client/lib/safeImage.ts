export function safeImage(src?: string | null) {
  if (!src) return "/default-avatar.png";

  // block Windows file paths
  if (src.startsWith("C:\\")) return "/default-avatar.png";

  return src;
}
