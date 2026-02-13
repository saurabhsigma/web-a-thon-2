'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, BookOpen, Video, FileText, BarChart, Settings } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/teacher/dashboard' },
  { icon: Users, label: 'Classes', href: '/teacher/classes' },
  { icon: BookOpen, label: 'Subjects', href: '/teacher/subjects' },
  { icon: Video, label: 'Sessions', href: '/teacher/sessions' },
  { icon: FileText, label: 'Materials', href: '/teacher/materials' },
  { icon: BarChart, label: 'Analytics', href: '/teacher/analytics' },
  { icon: Settings, label: 'Settings', href: '/teacher/settings' },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r bg-card lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-primary-foreground">E</span>
            </div>
            <span className="text-lg font-semibold">EduPlatform</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="flex-1">
                <p className="text-sm font-medium">Teacher Name</p>
                <p className="text-xs text-muted-foreground">Teacher</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center gap-4 border-b bg-card px-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Welcome Back</h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
