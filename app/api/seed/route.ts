import { NextResponse } from "next/server";
import { runSeed } from "@/lib/seed";

// One-off idempotent setup endpoint: seeds the catalog and, if ADMIN_EMAIL /
// ADMIN_PASSWORD are set in .dev.vars, creates the first admin user.
export async function GET() {
  const log = await runSeed();
  return NextResponse.json({ ok: true, log });
}
