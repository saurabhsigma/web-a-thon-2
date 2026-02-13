'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FaUsers, FaBook, FaChalkboardTeacher, FaGraduationCap, FaBookOpen } from 'react-icons/fa';

export default function StudentClassesPage() {
  const [classInfo, setClassInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassInfo();
  }, []);

  const fetchClassInfo = async () => {
    try {
      const response = await fetch('/api/classes');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setClassInfo(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching class:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userRole="student" userName="Student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-green-800">My Classroom</h1>
          <p className="text-gray-700 font-medium">Check out your class details and classmates!</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-green-500 border-t-transparent"></div>
            <p className="mt-4 text-xl font-bold text-gray-700">Loading class info...</p>
          </div>
        ) : !classInfo ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="doodle-card bg-blue-100 border-4 border-blue-600 p-16 text-center"
          >
            <FaBookOpen className="text-8xl text-blue-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Not in a Class Yet!
            </h2>
            <p className="text-lg text-gray-700 font-semibold">
              Your teacher will add you to a class soon. Hang tight!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Class Info Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card className="doodle-card bg-white border-4 border-green-600 h-full">
                <CardHeader className="bg-green-100">
                  <CardTitle className="text-2xl font-bold text-green-800 flex items-center gap-3">
                    <FaGraduationCap className="text-3xl" />
                    Class Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      {classInfo.name}
                    </h3>
                    <Badge className="bg-yellow-400 text-green-900 font-bold text-base px-4 py-2">
                      Grade {classInfo.grade}
                    </Badge>
                  </div>

                  {classInfo.description && (
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">About:</h4>
                      <p className="text-gray-700 font-medium">
                        {classInfo.description}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border-3 border-blue-400">
                    <FaUsers className="text-3xl text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Total Students</p>
                      <p className="text-2xl font-bold text-blue-800">
                        {classInfo.studentCount || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border-3 border-purple-400">
                    <FaBook className="text-3xl text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Subjects</p>
                      <p className="text-2xl font-bold text-purple-800">
                        {classInfo.subjectCount || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Teacher Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card className="doodle-card bg-white border-4 border-yellow-600 h-full">
                <CardHeader className="bg-yellow-100">
                  <CardTitle className="text-2xl font-bold text-yellow-800 flex items-center gap-3">
                    <FaChalkboardTeacher className="text-3xl" />
                    Your Teacher
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-blue-400 border-4 border-green-800 flex items-center justify-center">
                      <FaChalkboardTeacher className="text-4xl text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {classInfo.teacher?.name || 'Teacher Name'}
                    </h3>
                    <Badge className="bg-green-400 text-green-900 font-bold px-4 py-2">
                      Class Teacher
                    </Badge>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl border-3 border-green-400 text-center">
                    <p className="text-base font-semibold text-gray-700">
                      "Learning is an adventure! Let's explore together!"
                    </p>
                  </div>

                  {classInfo.teacher?.email && (
                    <div className="text-center">
                      <p className="text-xs text-gray-600 font-semibold mb-1">📧 Contact:</p>
                      <p className="text-sm font-semibold text-green-700">
                        {classInfo.teacher.email}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
