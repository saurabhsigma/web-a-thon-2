'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Video, Calendar } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'live' | 'completed'>('all');

  useEffect(() => {
    fetchSessions();
  }, [filter]);

  const fetchSessions = async () => {
    try {
      const url = filter === 'all' 
        ? '/api/sessions' 
        : `/api/sessions?status=${filter}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      scheduled: 'default',
      live: 'success',
      completed: 'secondary',
    };
    return <Badge variant={variants[status] || 'default'}>{status.toUpperCase()}</Badge>;
  };

  return (
    <DashboardLayout userRole="teacher" userName="Teacher">
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Sessions</h1>
          <p className="text-muted-foreground">Schedule and manage your virtual classes</p>
        </div>
        <Link href="/teacher/sessions/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Session
          </Button>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'scheduled', 'live', 'completed'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
            size="sm"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading sessions...</p>
        </div>
      ) : sessions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No sessions found.</p>
            <Link href="/teacher/sessions/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Your First Session
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <Card key={session._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle>{session.title}</CardTitle>
                      {getStatusBadge(session.status)}
                    </div>
                    <CardDescription className="mt-2">
                      {session.classId?.name} • {session.subjectId?.name}
                    </CardDescription>
                  </div>
                  {session.status === 'live' && (
                    <Link href={`/teacher/sessions/${session._id}/room`}>
                      <Button>
                        <Video className="mr-2 h-4 w-4" />
                        Join
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(session.scheduledAt)}
                  </div>
                  <div>
                    {formatTime(session.scheduledAt)} ({session.duration || 60} min)
                  </div>
                </div>
                {session.description && (
                  <p className="mt-2 text-sm">{session.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}
