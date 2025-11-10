import { useState } from 'react';
import { Calendar, Search, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface FilterSectionProps {
  onDateChange: (date: string) => void;
  onSearchChange: (search: string) => void;
  isLoading?: boolean;
}

export function FilterSection({
  onDateChange,
  onSearchChange,
  isLoading,
}: FilterSectionProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleClearDate = () => {
    setSelectedDate('');
    onDateChange('');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearchChange('');
  };

  const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    handleDateChange(today);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Tìm kiếm và lọc
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label htmlFor="search" className="text-sm font-medium flex items-center gap-2">
              <Search className="h-4 w-4" />
              Tìm kiếm theo tên hoặc mã sinh viên
            </label>
            <div className="relative">
              <Input
                id="search"
                type="text"
                placeholder="Nhập tên hoặc mã sinh viên..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                disabled={isLoading}
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Chọn ngày
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  disabled={isLoading}
                />
                {selectedDate && (
                  <button
                    onClick={handleClearDate}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                onClick={setToday}
                variant="outline"
                disabled={isLoading}
                className="whitespace-nowrap"
              >
                Hôm nay
              </Button>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Để trống ngày để xem tất cả dữ liệu. Sử dụng tìm kiếm để lọc theo tên hoặc mã sinh viên.
        </p>
      </CardContent>
    </Card>
  );
}

