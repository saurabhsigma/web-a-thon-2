'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaChartLine, FaTrophy, FaVideo, FaBook, 
  FaClock, FaCalendarAlt, FaUsers 
} from "react-icons/fa";

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    attendanceRate: 0,
    averageScore: 0,
    classRank: 0
  });

  return (
    <DashboardLayout userRole="student" userName="Student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-green-800">Student Dashboard</h1>
          <p className="text-gray-700 font-medium">Track your progress and upcoming classes.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { 
              title: "Attendance Rate", 
              value: `${stats.attendanceRate}%`, 
              subtitle: "Last 30 days",
              icon: FaChartLine,
              color: "bg-green-100",
              borderColor: "border-green-600",
              iconColor: "text-green-600"
            },
            { 
              title: "Average Score", 
              value: `${stats.averageScore}%`, 
              subtitle: "Across all quizzes",
              icon: FaTrophy,
              color: "bg-yellow-100",
              borderColor: "border-yellow-600",
              iconColor: "text-yellow-700"
            },
            { 
              title: "Class Rank", 
              value: stats.classRank ? `#${stats.classRank}` : "-", 
              subtitle: "In your class",
              icon: FaTrophy,
              color: "bg-purple-100",
              borderColor: "border-purple-600",
              iconColor: "text-purple-600"
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

        {/* Upcoming Sessions */}
        <Card className="doodle-card bg-white border-3 border-green-600">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-800 flex items-center gap-2">
              <FaVideo />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                <FaCalendarAlt className="text-2xl text-blue-600" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">No upcoming sessions</p>
                  <p className="text-sm text-gray-600">Check back later for new classes!</p>
                </div>
              </div>
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
                <FaBook className="text-2xl text-green-600" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">No recent activities yet</p>
                  <p className="text-sm text-gray-600">Start attending classes to see your progress!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
