'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FaUpload, FaFilePdf, FaFileVideo, FaFileWord, FaBook, FaPlus, FaTrash } from 'react-icons/fa';

export default function TeacherMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    subjectId: '',
    type: 'pdf',
    url: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [materialsRes, classesRes] = await Promise.all([
        fetch('/api/materials'),
        fetch('/api/classes'),
      ]);

      const materialsData = await materialsRes.json();
      const classesData = await classesRes.json();

      setMaterials(Array.isArray(materialsData) ? materialsData : (materialsData.materials || []));
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
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setDialogOpen(false);
        setFormData({
          title: '',
          description: '',
          classId: '',
          subjectId: '',
          type: 'pdf',
          url: '',
        });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to upload material:', error);
    }
  };

  const deleteMaterial = async (id: string) => {
    if (!confirm('Delete this material?')) return;

    try {
      await fetch(`/api/materials/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Failed to delete material:', error);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FaFilePdf className="text-4xl text-red-600" />;
      case 'video':
        return <FaFileVideo className="text-4xl text-purple-600" />;
      case 'document':
        return <FaFileWord className="text-4xl text-blue-600" />;
      default:
        return <FaBook className="text-4xl text-gray-600" />;
    }
  };

  return (
    <DashboardLayout userRole="teacher" userName="Teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Study Materials</h1>
            <p className="text-gray-700 font-medium">Upload and manage learning resources</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="doodle-button bg-green-600 text-white font-bold border-green-800">
                <FaPlus className="mr-2" />
                Upload Material
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Material</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Title"
                  type="text"
                  placeholder="e.g., Chapter 1 Notes"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />

                <div>
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea
                    className="w-full p-2 border-2 border-gray-300 rounded-lg"
                    rows={3}
                    placeholder="Brief description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Class</label>
                  <select
                    className="w-full p-2 border-2 border-gray-300 rounded-lg"
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    required
                  >
                    <option value="">Select class...</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Type</label>
                  <select
                    className="w-full p-2 border-2 border-gray-300 rounded-lg"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                  </select>
                </div>

                <Input
                  label="File URL"
                  type="text"
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />

                <Button type="submit" className="w-full doodle-button bg-yellow-500 text-green-900 font-bold">
                  <FaUpload className="mr-2" />
                  Upload Material
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Materials Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-green-500 border-t-transparent"></div>
            <p className="mt-4 text-xl font-bold text-gray-700">Loading materials...</p>
          </div>
        ) : materials.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="doodle-card bg-blue-100 border-4 border-blue-600 p-16 text-center"
          >
            <FaBook className="text-8xl text-blue-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No Materials Uploaded Yet
            </h2>
            <p className="text-lg text-gray-700 font-semibold">
              Click the "Upload Material" button to add your first resource!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="doodle-card bg-white border-4 border-green-600 h-full">
                  <CardHeader className="bg-green-100">
                    <div className="flex items-center justify-between mb-3">
                      {getFileIcon(material.type)}
                      <Button
                        onClick={() => deleteMaterial(material._id)}
                        className="doodle-button bg-red-500 text-white border-red-700 p-2"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                    <CardTitle className="text-lg font-bold text-green-800">
                      {material.title}
                    </CardTitle>
                    <Badge className="bg-yellow-400 text-yellow-900 font-bold mt-2">
                      {material.class?.name || 'All Classes'}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <p className="text-sm text-gray-700 font-medium">
                      {material.description || 'No description'}
                    </p>
                    <div className="text-xs text-gray-600 font-semibold">
                      Uploaded: {new Date(material.uploadedAt || Date.now()).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
