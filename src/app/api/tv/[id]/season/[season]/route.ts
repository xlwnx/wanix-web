import { NextResponse } from "next/server";
import { getTvSeason } from "@/lib/tmdb";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string; season: string }> }
) {
  try {
    const { id, season } = await context.params;
    const seasonNum = Number(season);
    if (!Number.isFinite(seasonNum) || seasonNum < 0) {
      return NextResponse.json({ error: "Invalid season" }, { status: 400 });
    }
    const data = await getTvSeason(id, seasonNum);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch TV season:", err);
    return NextResponse.json(
      { error: "Failed to load season episodes" },
      { status: 500 }
    );
  }
}
