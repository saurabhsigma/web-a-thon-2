'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaUsers, FaVideo, FaBook, FaChartLine, 
  FaPlus, FaClock, FaCalendarAlt 
} from "react-icons/fa";

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    upcomingSessions: 0,
    avgAttendance: 0
  });

  return (
    <DashboardLayout userRole="teacher" userName="Teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Teacher Dashboard</h1>
            <p className="text-gray-700 font-medium">Welcome back! Here's your overview.</p>
          </div>
          <Link href="/teacher/classes/create">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="doodle-button bg-green-500 hover:bg-green-600 text-white font-bold border-3 border-green-800">
                <FaPlus className="mr-2" />
                New Class
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { 
              title: "Total Classes", 
              value: stats.totalClasses, 
              subtitle: "Active classes",
              icon: FaUsers,
              color: "bg-blue-100",
              borderColor: "border-blue-600",
              iconColor: "text-blue-600"
            },
            { 
              title: "Total Students", 
              value: stats.totalStudents, 
              subtitle: "Across all classes",
              icon: FaUsers,
              color: "bg-green-100",
              borderColor: "border-green-600",
              iconColor: "text-green-600"
            },
            { 
              title: "Upcoming Sessions", 
              value: stats.upcomingSessions, 
              subtitle: "This week",
              icon: FaVideo,
              color: "bg-purple-100",
              borderColor: "border-purple-600",
              iconColor: "text-purple-600"
            },
            { 
              title: "Avg Attendance", 
              value: `${stats.avgAttendance}%`, 
              subtitle: "Last 30 days",
              icon: FaChartLine,
              color: "bg-yellow-100",
              borderColor: "border-yellow-600",
              iconColor: "text-yellow-700"
            }
          ].map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <Card className={`doodle-card ${stat.color} border-3 ${stat.borderColor} h-full`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-700">{stat.title}</CardTitle>
                  <stat.icon className={`text-2xl ${stat.iconColor}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                  <p className="text-xs text-gray-600 font-medium mt-1">{stat.subtitle}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="doodle-card bg-white border-3 border-green-600">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/teacher/classes/create">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="doodle-button w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold border-3 border-blue-600 h-auto py-4">
                    <FaUsers className="mr-2 text-xl" />
                    <span>Create Class</span>
                  </Button>
                </motion.div>
              </Link>
              <Link href="/teacher/sessions/create">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="doodle-button w-full bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold border-3 border-purple-600 h-auto py-4">
                    <FaVideo className="mr-2 text-xl" />
                    <span>Schedule Session</span>
                  </Button>
                </motion.div>
              </Link>
              <Link href="/teacher/subjects">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="doodle-button w-full bg-green-100 hover:bg-green-200 text-green-800 font-bold border-3 border-green-600 h-auto py-4">
                    <FaBook className="mr-2 text-xl" />
                    <span>Manage Subjects</span>
                  </Button>
                </motion.div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="doodle-card bg-white border-3 border-green-600">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-800 flex items-center gap-2">
              <FaClock />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border-2 border-green-300">
                <FaCalendarAlt className="text-2xl text-green-600" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">No recent activities yet</p>
                  <p className="text-sm text-gray-600">Start creating classes and sessions!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
