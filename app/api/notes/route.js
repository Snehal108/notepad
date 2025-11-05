import { nanoid } from "nanoid";
import dbConnect from "@/lib/dbConnect";
import Note from "@/models/Note";

export async function POST(req) {
  try {
    await dbConnect();

    // Generate unique short ID for note
    const id = nanoid(6);

    // Create an empty note with this ID
    await Note.create({ _id: id, content: "" });

    return Response.json({ id }, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
