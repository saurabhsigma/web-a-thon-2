'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FaBook, FaFileAlt, FaDownload, FaFilePdf, FaFileWord, FaFileVideo, FaFileImage } from 'react-icons/fa';

export default function StudentMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pdf' | 'video' | 'document'>('all');

  useEffect(() => {
    fetchMaterials();
  }, [filter]);

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/materials');
      if (response.ok) {
        const data = await response.json();
        let filtered = data;
        if (filter !== 'all') {
          filtered = data.filter((m: any) => m.type === filter);
        }
        setMaterials(filtered);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FaFilePdf className="text-3xl text-red-600" />;
      case 'video':
        return <FaFileVideo className="text-3xl text-purple-600" />;
      case 'document':
        return <FaFileWord className="text-3xl text-blue-600" />;
      default:
        return <FaFileAlt className="text-3xl text-gray-600" />;
    }
  };

  return (
    <DashboardLayout userRole="student" userName="Student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-green-800">Study Materials</h1>
          <p className="text-gray-700 font-medium">Access your learning resources!</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pdf', 'video', 'document'] as const).map((filterType) => (
            <Button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`doodle-button font-bold ${
                filter === filterType
                  ? 'bg-green-600 text-white border-green-800'
                  : 'bg-white text-green-800 border-green-600'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Button>
          ))}
        </div>

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
              No Materials Yet!
            </h2>
            <p className="text-lg text-gray-700 font-semibold">
              Your teacher will upload study materials soon. Stay tuned!
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
                    <div className="flex items-center gap-3 mb-2">
                      {getFileIcon(material.type)}
                      <Badge className="bg-yellow-400 text-yellow-900 font-bold">
                        {material.subject}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-green-800">
                      {material.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <p className="text-sm text-gray-700 font-medium">
                      {material.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-600 font-semibold">
                      <span>Uploaded: {new Date(material.uploadedAt).toLocaleDateString()}</span>
                      <span>{material.size || '2.5 MB'}</span>
                    </div>
                    <Button className="w-full doodle-button bg-green-600 text-white font-bold hover:bg-green-700">
                      <FaDownload className="mr-2" />
                      Download
                    </Button>
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
