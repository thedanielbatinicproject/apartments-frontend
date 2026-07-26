import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

// ============================================================
// PRIVREMENA ruta, samo za lokalni development — sprema kopiju
// skenirane slike na disk radi provjere što se točno šalje na
// pravi backend. Vidi src/lib/debug-save-scan.ts za pozivatelja.
//
// Blokirano izvan developmenta kao sigurnosna kočnica — čak i ako
// NEXT_PUBLIC_DEBUG_SAVE_SCANS ostane true, ova ruta u produkciji
// ne piše ništa na disk.
// ============================================================

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Disabled outside development" }, { status: 404 });
  }

  const form = await request.formData();
  const file = form.get("image");
  const label = typeof form.get("label") === "string" ? (form.get("label") as string) : "scan";

  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Missing image" }, { status: 400 });
  }

  const safeLabel = label.replace(/[^a-zA-Z0-9_-]/g, "_");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${timestamp}_${safeLabel}.jpg`;

  const dir = join(process.cwd(), "debug-scans");
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(dir, filename), buffer);

  return NextResponse.json({ saved: filename });
}
