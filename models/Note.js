import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },                 //tell mongoose to use String as id
    content: { type: String, default: "" },
    password: { type: String, default: "" },              // optional
    editable: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },            // for temporary notes
  },
  { timestamps: true }
);

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
