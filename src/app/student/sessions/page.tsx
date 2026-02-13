'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaVideo, FaUsers, FaClock, FaCalendarAlt, FaChalkboard } from 'react-icons/fa';

export default function StudentSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(Array.isArray(data) ? data : (data.sessions || []));
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinSession = async (sessionId: string) => {
    window.location.href = `/session/${sessionId}`;
  };

  return (
    <DashboardLayout userRole="student" userName="Student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-green-800">My Live Sessions</h1>
          <p className="text-gray-700 font-medium">Join your classes and have fun learning!</p>
        </div>

        {/* Sessions Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-green-500 border-t-transparent"></div>
            <p className="mt-4 text-xl font-bold text-gray-700">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="doodle-card bg-yellow-100 border-4 border-yellow-600 p-16 text-center"
          >
            <FaChalkboard className="text-8xl text-yellow-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No Sessions Yet!
            </h2>
            <p className="text-lg text-gray-700 font-semibold">
              Your teacher will schedule classes soon. Check back later!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session, idx) => (
              <motion.div
                key={session._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <Card className="doodle-card bg-white border-4 border-green-600 h-full">
                  <CardHeader className="bg-green-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-green-800">
                        {session.title}
                      </CardTitle>
                      <Badge className={`text-sm font-bold ${session.status === 'live' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'
                        }`}>
                        {session.status === 'live' ? '🔴 LIVE' : session.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-xl text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-700 text-sm">
                          {new Date(session.startTime).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600 font-medium">
                          {new Date(session.startTime).toLocaleTimeString()} -
                          {new Date(session.endTime).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {session.description && (
                      <p className="text-gray-700 font-medium text-sm">
                        {session.description}
                      </p>
                    )}

                    {session.status === 'live' && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() => joinSession(session._id)}
                          className="doodle-button w-full bg-green-500 hover:bg-green-600 text-white font-bold border-3 border-green-800"
                        >
                          <FaVideo className="mr-2" />
                          Join Class Now!
                        </Button>
                      </motion.div>
                    )}
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
