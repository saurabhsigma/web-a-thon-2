'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, BookOpen } from 'lucide-react';

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      const data = await res.json();
      setClasses(data.classes || []);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userRole="teacher" userName="Teacher">
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Classes</h1>
          <p className="text-muted-foreground">Manage your classes and students</p>
        </div>
        <Link href="/teacher/classes/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Class
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading classes...</p>
        </div>
      ) : classes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">You haven't created any classes yet.</p>
            <Link href="/teacher/classes/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Class
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Link key={cls._id} href={`/teacher/classes/${cls._id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{cls.name}</CardTitle>
                  <CardDescription>
                    Grade {cls.grade} {cls.section && `- Section ${cls.section}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{cls.students?.length || 0} Students</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{cls.subjects?.length || 0} Subjects</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}
