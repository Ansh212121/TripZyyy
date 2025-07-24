import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';

// GET: Fetch all notes
export async function GET() {
  await dbConnect();
  const notes = await Note.find({}).sort({ createdAt: -1 });
  return NextResponse.json(notes);
}

// POST: Create a new note
export async function POST(req) {
  await dbConnect();
  const { title, content } = await req.json();
  
  if (!title || !content) {
    return NextResponse.json(
      { error: 'Title and content are required.' },
      { status: 400 }
    );
  }

  const note = await Note.create({ title, content });
  return NextResponse.json(note, { status: 201 });
}

// DELETE: Delete all notes (for demo purposes)
export async function DELETE() {
  await dbConnect();
  await Note.deleteMany({});
  return NextResponse.json({ message: 'All notes deleted.' });
}
