'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  FaBook, FaFilePdf, FaVideo, FaImage, FaLink,
  FaSearch, FaSpinner, FaDownload, FaExternalLinkAlt
} from 'react-icons/fa';

export default function StudentMaterialsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledClass, setEnrolledClass] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [selectedSubject, enrolledClass]);

  const fetchData = async () => {
    try {
      // 1. Get Enrolled Class
      const clsRes = await fetch('/api/classes');
      const clsData = await clsRes.json();

      // Assumes student has one enrolled class returned or logic handles it in API
      // The API returns { classes: [...] } and for students if enrolled they get their class with isEnrolled=true
      // ACTUALLY, checking the API logic we implemented:
      // "If student, return all classes, mark isEnrolled" OR "fetch user to get classId".
      // Let's assume the first class in the list that isEnrolled is the one.

      const myClass = clsData.classes?.find((c: any) => c.isEnrolled) || clsData.classes?.[0]; // Fallback?

      if (myClass) {
        setEnrolledClass(myClass);

        // 2. Get Subjects for this class
        const subRes = await fetch(`/api/subjects?classId=${myClass._id}`);
        const subData = await subRes.json();
        setSubjects(subData.subjects || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // Don't stop loading here, wait for materials
    }
  };

  const fetchMaterials = async () => {
    if (!enrolledClass) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let url = '/api/materials?';

      if (selectedSubject !== 'all') {
        url += `subjectId=${selectedSubject}`;
      } else {
        // If 'all', we might need to filter by classId provided implicitly 
        // via fetching all subjects of this class
        // The API GET /api/materials supports 'subjectId'. 
        // It also implemented logic "if classId provided... find subjects". 
        // So let's pass classId=enrolledClass._id
        url += `classId=${enrolledClass._id}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMaterials(data.materials || []);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FaFilePdf className="text-red-500 text-3xl" />;
      case 'video': return <FaVideo className="text-blue-500 text-3xl" />;
      case 'image': return <FaImage className="text-purple-500 text-3xl" />;
      case 'link': return <FaLink className="text-green-500 text-3xl" />;
      default: return <FaBook className="text-gray-500 text-3xl" />;
    }
  };

  return (
    <DashboardLayout userRole="student" userName="Student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-green-800">My Study Materials</h1>
          <p className="text-gray-700 font-medium">
            {enrolledClass ? `Resources for ${enrolledClass.name}` : 'Explore learning resources'}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border-2 border-gray-200 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <Button
              variant={selectedSubject === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedSubject('all')}
              className={`rounded-full ${selectedSubject === 'all' ? 'bg-gray-800 text-white' : ''}`}
            >
              All Subjects
            </Button>
            {subjects.map(sub => (
              <Button
                key={sub._id}
                variant={selectedSubject === sub._id ? 'default' : 'outline'}
                onClick={() => setSelectedSubject(sub._id)}
                className={`rounded-full ${selectedSubject === sub._id ? 'text-white' : ''}`}
                style={selectedSubject === sub._id ? { backgroundColor: sub.color, borderColor: sub.color } : { color: sub.color, borderColor: sub.color }}
              >
                {sub.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Materials List */}
        {loading ? (
          <div className="text-center py-20">
            <FaSpinner className="animate-spin text-4xl text-green-500 mx-auto" />
            <p className="mt-4 text-gray-500">Loading your materials...</p>
          </div>
        ) : materials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-yellow-50 rounded-xl border-2 border-dashed border-yellow-400"
          >
            <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400">
              <FaBook className="text-4xl text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No Materials Found</h3>
            <p className="text-gray-600">Your teachers haven't uploaded any resources for this subject yet.</p>
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
                <Card className="doodle-card hover:shadow-xl transition-all border-4 border-gray-100 hover:border-green-300 h-full flex flex-col group">
                  <CardHeader className="bg-gradient-to-br from-white to-gray-50 pb-4 border-b border-gray-100">
                    <div className="flex gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                        {getIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <Badge
                          variant="outline"
                          className="mb-2 bg-opacity-10 border-0"
                          style={{ backgroundColor: item.subjectId?.color + '20', color: item.subjectId?.color }}
                        >
                          {item.subjectId?.name}
                        </Badge>
                        <CardTitle className="text-lg font-bold text-gray-800 leading-tight">
                          {item.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1 flex flex-col">
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">{item.description}</p>

                    <div className="mt-auto space-y-3">
                      <div className="flex justify-between items-center text-xs text-gray-400 font-medium px-1">
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        {item.fileSize && <span>{(item.fileSize / 1024 / 1024).toFixed(1)} MB</span>}
                      </div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold doodle-button border-green-800">
                          {item.type === 'link' ? (
                            <>
                              <FaExternalLinkAlt className="mr-2" /> Open Link
                            </>
                          ) : (
                            <>
                              <FaDownload className="mr-2" /> Download
                            </>
                          )}
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
