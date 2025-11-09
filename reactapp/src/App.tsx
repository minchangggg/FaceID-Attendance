import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2 } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { StatCards } from './components/StatCards';
import { FilterSection } from './components/FilterSection';
import { DataChart } from './components/DataChart';
import { DataTable } from './components/DataTable';
import { getCurrentData, getFilteredData, controlDevice } from './services/api';
import type { SensorData, ControlPayload } from './types/api';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [filteredData, setFilteredData] = useState<SensorData[]>([]);
  const queryClient = useQueryClient();

  // Toggle dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Fetch current data
  const { data: currentData, isLoading } = useQuery({
    queryKey: ['currentData'],
    queryFn: getCurrentData,
    refetchInterval: autoUpdate ? 30000 : false, // 30 seconds
    retry: 2,
  });

  // Control device mutation
  const controlMutation = useMutation({
    mutationFn: controlDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentData'] });
    },
  });

  const handleToggleFan = () => {
    if (!currentData) return;
    
    const payload: ControlPayload = {
      temperature: currentData.temperature,
      number_people: currentData.number_people,
      fan_status: currentData.fan_status === 1 ? 0 : 1,
      light_status: currentData.light_status,
    };
    
    controlMutation.mutate(payload);
  };

  const handleToggleLight = () => {
    if (!currentData) return;
    
    const payload: ControlPayload = {
      temperature: currentData.temperature,
      number_people: currentData.number_people,
      fan_status: currentData.fan_status,
      light_status: currentData.light_status === 1 ? 0 : 1,
    };
    
    controlMutation.mutate(payload);
  };

  const handleFilter = async (startDate: string, endDate: string) => {
    try {
      const data = await getFilteredData({
        start_time: startDate,
        end_time: endDate,
      });
      setFilteredData(data);
    } catch (error) {
      console.error('Error filtering data:', error);
    }
  };

  const displayData = filteredData.length > 0 ? filteredData : currentData ? [currentData] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Hệ Thống Quản Lý Phòng Học</h1>
              <p className="text-xs text-muted-foreground">Classroom Management System</p>
            </div>
          </div>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Current Status Cards */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Thông tin hiện tại</h2>
          <StatCards
            data={currentData || null}
            onToggleFan={handleToggleFan}
            onToggleLight={handleToggleLight}
            isLoading={isLoading || controlMutation.isPending}
          />
        </section>

        {/* Filter Section */}
        <FilterSection
          onFilter={handleFilter}
          autoUpdate={autoUpdate}
          onToggleAutoUpdate={() => setAutoUpdate(!autoUpdate)}
          isLoading={isLoading}
        />

        {/* Charts and Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataChart data={displayData} />
          <DataTable data={displayData} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2024 Classroom Management System. Built with React + TypeScript + Vite</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

