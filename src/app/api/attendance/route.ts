import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Attendance from '@/models/Attendance';
import Session from '@/models/Session';
import connectDB from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Get attendance records
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const studentId = searchParams.get('studentId');
    const classId = searchParams.get('classId');

    let query: any = {};
    
    // Students can only see their own attendance
    if (decoded.role === 'student') {
      query.studentId = decoded.userId;
    } else if (decoded.role === 'teacher' && studentId) {
      query.studentId = studentId;
    }

    if (sessionId) {
      query.sessionId = sessionId;
    }

    const attendance = await Attendance.find(query)
      .populate('sessionId', 'title scheduledAt')
      .populate('studentId', 'name email')
      .sort({ joinTime: -1 });

    // Calculate statistics
    const stats = {
      totalSessions: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      late: attendance.filter(a => a.status === 'late').length,
      averageDuration: attendance.length > 0 
        ? Math.round(attendance.reduce((sum, a) => sum + (a.duration || 0), 0) / attendance.length)
        : 0,
    };

    return NextResponse.json({ attendance, stats }, { status: 200 });
  } catch (error: any) {
    console.error('Get attendance error:', error);
    return NextResponse.json({ error: 'Failed to get attendance' }, { status: 500 });
  }
}

// Manual attendance marking (for teachers)
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

    const { sessionId, studentId, status } = await req.json();

    if (!sessionId || !studentId || !status) {
      return NextResponse.json(
        { error: 'Session ID, student ID, and status are required' },
        { status: 400 }
      );
    }

    // Verify session exists and belongs to teacher
    const session = await Session.findOne({
      _id: sessionId,
      teacherId: decoded.userId,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found or unauthorized' },
        { status: 404 }
      );
    }

    // Check if attendance already exists
    let attendance = await Attendance.findOne({ sessionId, studentId });

    if (attendance) {
      // Update existing attendance
      attendance.status = status;
      attendance.isAutoMarked = false;
      await attendance.save();
    } else {
      // Create new attendance record
      attendance = await Attendance.create({
        sessionId,
        studentId,
        status,
        isAutoMarked: false,
        joinTime: new Date(),
        duration: 0,
      });
    }

    return NextResponse.json(
      { message: 'Attendance marked successfully', attendance },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Mark attendance error:', error);
    return NextResponse.json({ error: 'Failed to mark attendance' }, { status: 500 });
  }
}
