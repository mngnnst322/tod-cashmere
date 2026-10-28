/** Longest side kept for uploaded photos; enough for the hover zoom. */
const MAX_SIDE = 3000;
/** Files under this size and within MAX_SIDE are uploaded untouched. */
const SMALL_ENOUGH = 2 * 1024 * 1024;

/**
 * Re-encodes a large photo (AI-enhanced shots are often 15–40MB) as a 92%
 * JPEG of at most MAX_SIDE px, so a form with several photos stays under the
 * Server Action upload limit. Falls back to the original if the browser
 * can't decode it.
 */
export async function shrinkImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size <= SMALL_ENOUGH) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.92));
    if (!blob || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
