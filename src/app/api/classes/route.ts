import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Class from '@/models/Class';
import connectDB from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Get all classes for teacher
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (decoded.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const classes = await Class.find({ teacherId: decoded.userId })
      .populate('students', 'name email avatar')
      .populate('subjects')
      .sort({ createdAt: -1 });

    return NextResponse.json({ classes }, { status: 200 });
  } catch (error: any) {
    console.error('Get classes error:', error);
    return NextResponse.json({ error: 'Failed to get classes' }, { status: 500 });
  }
}

// Create new class
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (decoded.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const { name, grade, section, description, schedule } = await req.json();

    if (!name || !grade) {
      return NextResponse.json({ error: 'Name and grade are required' }, { status: 400 });
    }

    const newClass = await Class.create({
      name,
      grade,
      section,
      description,
      teacherId: decoded.userId,
      schedule: schedule || [],
      students: [],
      subjects: [],
    });

    return NextResponse.json(
      { message: 'Class created successfully', class: newClass },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create class error:', error);
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
  }
}
