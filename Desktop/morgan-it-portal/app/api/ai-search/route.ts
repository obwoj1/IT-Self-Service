import { NextRequest, NextResponse } from "next/server";
import { getAiAnswer } from "@/lib/ai-cache";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";

  if (!q.trim()) {
    return NextResponse.json({ error: "q parameter is required" }, { status: 400 });
  }

  const result = await getAiAnswer(q);

  if (!result) {
    return NextResponse.json(
      { error: "AI search is unavailable — check ANTHROPIC_API_KEY" },
      { status: 503 }
    );
  }

  return NextResponse.json(result);
}
