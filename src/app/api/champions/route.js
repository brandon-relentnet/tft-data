// app/api/champions/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Cache mechanism
let cachedData = null;
let cacheTime = 0;
const CACHE_MAX_AGE = 3600000;

// Path to your JSON file
const CHAMPION_DATA_PATH = path.join(
  process.cwd(),
  "backend",
  "data",
  "champions.json"
);

// GET handler for App Router
export async function GET() {
  try {
    const now = Date.now();

    // Return cached data if it's still fresh
    if (cachedData && now - cacheTime < CACHE_MAX_AGE) {
      return NextResponse.json(cachedData);
    }

    // Read and parse the JSON file
    const fileContents = fs.readFileSync(CHAMPION_DATA_PATH, "utf-8");

    // Parse JSON (only once)
    cachedData = JSON.parse(fileContents);
    cacheTime = now;

    // Return the JSON response
    return NextResponse.json(cachedData);
  } catch (error) {
    console.error("Error reading champion data:", error);
    return NextResponse.json(
      { error: "Failed to load champion data" },
      { status: 500 }
    );
  }
}
