'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  FaChalkboard, FaChalkboardTeacher, FaVideo, FaBook,
  FaUsers, FaGraduationCap, FaTrophy, FaQuestionCircle,
  FaSignOutAlt, FaHome, FaClock, FaClipboardList
} from 'react-icons/fa';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: 'teacher' | 'student';
  userName?: string;
}

export default function DashboardLayout({ children, userRole, userName }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const teacherNavItems = [
    { href: '/teacher/dashboard', icon: FaHome, label: 'Dashboard' },
    { href: '/teacher/classes', icon: FaUsers, label: 'Classes' },
    { href: '/teacher/subjects', icon: FaBook, label: 'Subjects' },
    { href: '/teacher/sessions', icon: FaVideo, label: 'Sessions' },
    { href: '/teacher/attendance', icon: FaClipboardList, label: 'Attendance' },
  ];

  const studentNavItems = [
    { href: '/student/dashboard', icon: FaHome, label: 'Dashboard' },
    { href: '/student/classes', icon: FaUsers, label: 'My Class' },
    { href: '/student/sessions', icon: FaVideo, label: 'Sessions' },
  ];

  const navItems = userRole === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b-4 border-green-800 bg-yellow-100/95 backdrop-blur-sm shadow-lg"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 border-3 border-green-800 shadow-md">
              <FaChalkboard className="text-xl text-white" />
            </div>
            <span className="text-xl font-bold text-green-800">
              ClassRoom
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {userName && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-100 border-2 border-green-600 rounded-lg">
                {userRole === 'teacher' ? (
                  <FaChalkboardTeacher className="text-green-700" />
                ) : (
                  <FaGraduationCap className="text-green-700" />
                )}
                <span className="font-semibold text-green-800">{userName}</span>
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="doodle-button border-red-600 bg-white hover:bg-red-50 text-red-600 font-semibold"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="hidden md:block w-64 min-h-[calc(100vh-4rem)] border-r-4 border-green-800 bg-white/80 backdrop-blur-sm p-4"
        >
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${isActive
                          ? 'bg-green-500 border-green-800 text-white shadow-md'
                          : 'bg-white border-green-600 text-green-800 hover:bg-green-50'
                        }`}
                    >
                      <item.icon className="text-lg" />
                      <span className="font-semibold">{item.label}</span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl border-3 border-green-600">
            <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
              <FaTrophy className="text-yellow-600" />
              Quick Stats
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Points:</span>
                <span className="font-bold text-green-700">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Badges:</span>
                <span className="font-bold text-green-700">0</span>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t-4 border-green-800 bg-yellow-100 shadow-lg">
          <nav className="flex justify-around py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${isActive ? 'text-green-800' : 'text-gray-600'
                      }`}
                  >
                    <item.icon className={`text-xl ${isActive ? 'text-green-800' : ''}`} />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
