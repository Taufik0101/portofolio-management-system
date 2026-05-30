import { NextResponse } from "next/server";
import { getPortfolioItems, createPortfolioItem } from "@/lib/database";

// GET all portfolio items
export async function GET() {
  try {
    const items = await getPortfolioItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

// POST create new portfolio item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newItem = await createPortfolioItem({
      title: body.title,
      description: body.description,
      category: body.category,
      imageUrl: body.imageUrl,
      projectUrl: body.projectUrl,
      techStack: body.techStack,
    });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
