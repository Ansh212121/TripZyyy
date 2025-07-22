import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';

// GET: Fetch a single note by ID
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const note = await Note.findById(params.id);
  if (!note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }
  return NextResponse.json(note);
}

// PUT: Update a note by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { title, content } = await req.json();
  const note = await Note.findByIdAndUpdate(
    params.id,
    { title, content },
    { new: true, runValidators: true }
  );
  if (!note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }
  return NextResponse.json(note);
}

// DELETE: Delete a note by ID
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const note = await Note.findByIdAndDelete(params.id);
  if (!note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Note deleted' });
} 