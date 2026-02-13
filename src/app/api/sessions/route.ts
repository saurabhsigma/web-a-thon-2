import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Session from '@/models/Session';
import Class from '@/models/Class';
import connectDB from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Get all sessions
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    await connectDB();

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const status = searchParams.get('status');

    let query: any = {};
    if (decoded.role === 'teacher') {
      query.teacherId = decoded.userId;
    }
    if (classId) {
      query.classId = classId;
    }
    if (status) {
      query.status = status;
    }

    const sessions = await Session.find(query)
      .populate('classId', 'name grade section')
      .populate('subjectId', 'name color')
      .populate('teacherId', 'name email')
      .sort({ scheduledStartTime: -1 });

    return NextResponse.json({ sessions }, { status: 200 });
  } catch (error: any) {
    console.error('Get sessions error:', error);
    return NextResponse.json({ error: 'Failed to get sessions' }, { status: 500 });
  }
}

// Create new session
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

    const { title, classId, subjectId, scheduledStartTime, scheduledEndTime, description } = await req.json();

    if (!title || !classId || !subjectId || !scheduledStartTime) {
      return NextResponse.json(
        { error: 'Title, classId, subjectId, and scheduledStartTime are required' },
        { status: 400 }
      );
    }

    // Verify class belongs to teacher
    const classExists = await Class.findOne({
      _id: classId,
      teacherId: decoded.userId,
    });

    if (!classExists) {
      return NextResponse.json(
        { error: 'Class not found or unauthorized' },
        { status: 404 }
      );
    }

    // Generate unique room ID
    const livekitRoomId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Calculate duration from start and end times
    const startTime = new Date(scheduledStartTime);
    const endTime = scheduledEndTime ? new Date(scheduledEndTime) : new Date(startTime.getTime() + 60 * 60 * 1000);
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    const session = await Session.create({
      title,
      classId,
      subjectId,
      teacherId: decoded.userId,
      scheduledAt: startTime,
      duration: durationMinutes,
      description,
      livekitRoomId,
      status: 'scheduled',
    });

    return NextResponse.json(
      { message: 'Session created successfully', session },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create session error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
