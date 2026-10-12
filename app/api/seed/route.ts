import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { runSeed } from "@/lib/seed";

// Idempotent setup endpoint: seeds the demo catalog. Admin-only, otherwise
// anyone could re-insert seed products the admin has deleted.
export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  const log = await runSeed();
  return NextResponse.json({ ok: true, log });
}
