'use client';
// Force rebuild

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  FaBook, FaFilePdf, FaVideo, FaImage, FaLink, FaPlus,
  FaTrash, FaSearch, FaCloudUploadAlt, FaSpinner
} from 'react-icons/fa';
import CloudinaryUploadWidget from '@/components/CloudinaryUploadWidget';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function TeacherMaterialsPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'pdf',
    url: '',
    thumbnail: '',
    fileSize: 0
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchSubjects(selectedClass);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedSubject) {
      fetchMaterials(selectedSubject);
    } else {
      setMaterials([]);
    }
  }, [selectedSubject]);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      if (response.ok) {
        const data = await response.json();
        setClasses(data.classes || []);
        if (data.classes?.length > 0) {
          setSelectedClass(data.classes[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async (classId: string) => {
    try {
      const response = await fetch(`/api/subjects?classId=${classId}`);
      if (response.ok) {
        const data = await response.json();
        setSubjects(data.subjects || []);
        if (data.subjects?.length > 0) {
          setSelectedSubject(data.subjects[0]._id);
        } else {
          setSelectedSubject('');
          setMaterials([]);
        }
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchMaterials = async (subjectId: string) => {
    setLoadingMaterials(true);
    try {
      const response = await fetch(`/api/materials?subjectId=${subjectId}`);
      if (response.ok) {
        const data = await response.json();
        setMaterials(data.materials || []);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoadingMaterials(false);
    }
  };

  const handleUploadSuccess = (result: any) => {
    setFormData(prev => ({
      ...prev,
      url: result.secure_url,
      thumbnail: result.thumbnail_url || '',
      fileSize: result.bytes,
      type: determineType(result.format, result.resource_type)
    }));
  };

  const determineType = (format: string, resourceType: string) => {
    if (resourceType === 'video') return 'video';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(format)) return 'image';
    if (format === 'pdf') return 'pdf';
    return 'other';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) {
      alert('Please select a subject first');
      return;
    }

    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subjectId: selectedSubject
        })
      });

      if (res.ok) {
        alert('Material uploaded successfully!');
        setIsUploadModalOpen(false);
        setFormData({ title: '', description: '', type: 'pdf', url: '', thumbnail: '', fileSize: 0 });
        fetchMaterials(selectedSubject);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to upload material');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;
    try {
      const res = await fetch(`/api/materials?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMaterials(selectedSubject);
      } else {
        alert('Failed to delete');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FaFilePdf className="text-red-500 text-2xl" />;
      case 'video': return <FaVideo className="text-blue-500 text-2xl" />;
      case 'image': return <FaImage className="text-purple-500 text-2xl" />;
      case 'link': return <FaLink className="text-green-500 text-2xl" />;
      default: return <FaBook className="text-gray-500 text-2xl" />;
    }
  };

  return (
    <DashboardLayout userRole="teacher" userName="Teacher">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Study Materials</h1>
            <p className="text-gray-700 font-medium">Upload and manage resources for your students</p>
          </div>

          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <Button className="doodle-button bg-blue-600 text-white hover:bg-blue-700 font-bold border-blue-800">
                <FaCloudUploadAlt className="mr-2 text-xl" />
                Upload Material
              </Button>
            </DialogTrigger>
            <DialogContent className="doodle-card border-4 border-blue-600 sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-800">Upload New Material</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Chapter 1 Notes"
                    required
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description..."
                  />
                </div>

                {!formData.url ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <CloudinaryUploadWidget onUpload={handleUploadSuccess} />
                  </div>
                ) : (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200 flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      {getIcon(formData.type)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-green-800 truncate">File Uploaded</p>
                      <p className="text-xs text-green-600 truncate">{formData.url}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData({ ...formData, url: '', thumbnail: '', fileSize: 0 })}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                )}

                {/* Fallback for Link type if not uploading file */}
                {/* For now, simplified to just upload or generic URL if we wanted to add that field manually */}

                <Button type="submit" disabled={!formData.url} className="w-full bg-blue-600 hover:bg-blue-700">
                  Publish Material
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border-2 border-gray-200">
          <div>
            <Label className="mb-2 block font-bold text-gray-700">Select Class</Label>
            <div className="flex gap-2 flex-wrap">
              {classes.map(cls => (
                <Button
                  key={cls._id}
                  variant={selectedClass === cls._id ? 'default' : 'outline'}
                  onClick={() => setSelectedClass(cls._id)}
                  className={`rounded-full ${selectedClass === cls._id ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  {cls.name}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-2 block font-bold text-gray-700">Select Subject</Label>
            <div className="flex gap-2 flex-wrap">
              {subjects.length > 0 ? subjects.map(sub => (
                <Button
                  key={sub._id}
                  variant={selectedSubject === sub._id ? 'default' : 'outline'}
                  onClick={() => setSelectedSubject(sub._id)}
                  className={`rounded-full ${selectedSubject === sub._id ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  style={selectedSubject !== sub._id ? { color: sub.color, borderColor: sub.color } : { backgroundColor: sub.color }}
                >
                  {sub.name}
                </Button>
              )) : (
                <p className="text-gray-500 text-sm italic">No subjects found for this class.</p>
              )}
            </div>
          </div>
        </div>

        {/* Materials List */}
        {loadingMaterials ? (
          <div className="text-center py-20">
            <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto" />
            <p className="mt-4 text-gray-500">Loading materials...</p>
          </div>
        ) : materials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
          >
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBook className="text-4xl text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-700">No Materials Yet</h3>
            <p className="text-gray-500">Select a subject and upload your first resource!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="doodle-card hover:shadow-lg transition-shadow border-2 border-gray-200 overflow-hidden h-full flex flex-col">
                  <CardHeader className="bg-gray-50 pb-2 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        {getIcon(item.type)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item._id)}
                        className="text-gray-400 hover:text-red-500 h-8 w-8"
                      >
                        <FaTrash size={14} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{item.description}</p>

                    <div className="mt-auto">
                      <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        {item.fileSize && <span>{(item.fileSize / 1024 / 1024).toFixed(2)} MB</span>}
                      </div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                          View Resource
                        </Button>
                      </a>
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
