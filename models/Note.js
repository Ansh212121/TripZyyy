import mongoose, { Schema, models } from 'mongoose';

const NoteSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Note = models.Note || mongoose.model('Note', NoteSchema);

export default Note; 