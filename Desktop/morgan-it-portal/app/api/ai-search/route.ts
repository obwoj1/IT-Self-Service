import { NextRequest, NextResponse } from "next/server";
import { getAiAnswer } from "@/lib/ai-cache";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const MAX_QUERY_LENGTH = 200;
const RATE_LIMIT_MAX = 10;       // requests per window
const RATE_LIMIT_WINDOW = 60_000; // 1 minute in ms

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);

  if (!rateLimit(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
    return NextResponse.json(
      { error: "Too many requests — wait a minute before searching again." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const raw = request.nextUrl.searchParams.get("q") ?? "";
  const q = raw.trim().slice(0, MAX_QUERY_LENGTH);

  if (!q) {
    return NextResponse.json({ error: "q parameter is required" }, { status: 400 });
  }

  const result = await getAiAnswer(q);

  if (!result) {
    return NextResponse.json(
      { error: "AI search unavailable — check ANTHROPIC_API_KEY" },
      { status: 503 }
    );
  }

  return NextResponse.json(result);
}
