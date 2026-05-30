import { NextResponse } from "next/server";
import { getPortfolioItemById, updatePortfolioItem, deletePortfolioItem } from "@/lib/database";

// GET single portfolio item
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = await getPortfolioItemById(params.id);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching portfolio item:", error);
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

// PUT update portfolio item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const item = await updatePortfolioItem(params.id, {
      title: body.title,
      description: body.description,
      category: body.category,
      imageUrl: body.imageUrl,
      projectUrl: body.projectUrl,
      techStack: body.techStack,
    });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// DELETE portfolio item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deletePortfolioItem(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Item deleted" });
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
