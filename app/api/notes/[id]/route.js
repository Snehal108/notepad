
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Note from "@/models/Note";

//GET a specific note
export async function GET(request, { params }) {
  const { id } = await params;                                      // await only the params
  await dbConnect();

  const note = await Note.findById(id);
  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }
  return NextResponse.json(note);
}

// PUT (update or create note)

export async function PUT(request, { params }) {
  const { id } = await params;                                             // fixes the warning
  const { content } = await request.json();

  await dbConnect();

  const note = await Note.findByIdAndUpdate(
    id,
    { content, updatedAt: new Date() },
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true, note });
}
