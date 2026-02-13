'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, BookOpen } from 'lucide-react';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    classId: '',
    description: '',
    color: '#6366F1',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subjectsRes, classesRes] = await Promise.all([
        fetch('/api/subjects'),
        fetch('/api/classes'),
      ]);

      const subjectsData = await subjectsRes.json();
      const classesData = await classesRes.json();

      setSubjects(subjectsData.subjects || []);
      setClasses(classesData.classes || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setDialogOpen(false);
        setFormData({ name: '', classId: '', description: '', color: '#6366F1' });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create subject:', error);
    }
  };

  return (
    <DashboardLayout userRole="teacher" userName="Teacher">
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subjects</h1>
          <p className="text-muted-foreground">Manage subjects across all classes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subject</DialogTitle>
              <DialogDescription>Add a subject to one of your classes</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Subject Name"
                type="text"
                placeholder="e.g., Physics"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div>
                <label className="text-sm font-medium mb-1.5 block">Class</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name} - Grade {cls.grade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Description (Optional)
                </label>
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Brief description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Color</label>
                <input
                  type="color"
                  className="h-10 w-full rounded-md border border-input"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full">
                Create Subject
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading subjects...</p>
        </div>
      ) : subjects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No subjects found. Create your first subject.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Card key={subject._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: subject.color + '20' }}
                  >
                    <BookOpen className="h-5 w-5" style={{ color: subject.color }} />
                  </div>
                  <div>
                    <CardTitle>{subject.name}</CardTitle>
                    <CardDescription>
                      {subject.classId?.name} - Grade {subject.classId?.grade}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              {subject.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{subject.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}
