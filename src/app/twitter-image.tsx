export { alt, size, contentType } from "@/lib/og-image";
import { generateOgImage } from "@/lib/og-image";

export default function Image() {
  return generateOgImage();
}
