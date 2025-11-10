import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserCheck } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { FilterSection } from './components/FilterSection';
import { StudentList } from './components/StudentList';
import { getAttendanceLogs } from './services/api';
import type { AttendanceLog } from './types/api';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const { data: attendanceLogs = [], isLoading } = useQuery({
    queryKey: ['attendanceLogs', selectedDate],
    queryFn: () => getAttendanceLogs(selectedDate ? { date: selectedDate } : undefined),
    refetchInterval: 30000,
    retry: 2,
  });

  const filteredLogs = useMemo(() => {
    if (!searchTerm) return attendanceLogs;
    
    const term = searchTerm.toLowerCase();
    return attendanceLogs.filter((log: AttendanceLog) => 
      log.name.toLowerCase().includes(term) || 
      log.student_id.toLowerCase().includes(term)
    );
  }, [attendanceLogs, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Hệ Thống Điểm Danh FaceID</h1>
              <p className="text-xs text-muted-foreground">FaceID Attendance System</p>
            </div>
          </div>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Danh sách điểm danh</h2>
          <FilterSection
            onDateChange={setSelectedDate}
            onSearchChange={setSearchTerm}
            isLoading={isLoading}
          />
        </section>

        <StudentList data={filteredLogs} isLoading={isLoading} />
      </main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2024 FaceID Attendance System. Built with React + TypeScript + Vite</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

