import { useState } from 'react';
import { Calendar, Filter, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface FilterSectionProps {
  onFilter: (startDate: string, endDate: string) => void;
  autoUpdate: boolean;
  onToggleAutoUpdate: () => void;
  isLoading?: boolean;
}

export function FilterSection({
  onFilter,
  autoUpdate,
  onToggleAutoUpdate,
  isLoading,
}: FilterSectionProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilter = () => {
    if (startDate && endDate) {
      onFilter(startDate, endDate);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Lọc dữ liệu theo thời gian
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label htmlFor="start-date" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Từ ngày
            </label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex-1 space-y-2">
            <label htmlFor="end-date" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Đến ngày
            </label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleFilter}
              disabled={!startDate || !endDate || isLoading}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Lọc dữ liệu
            </Button>
            <Button
              onClick={onToggleAutoUpdate}
              variant={autoUpdate ? 'success' : 'outline'}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${autoUpdate ? 'animate-spin' : ''}`} />
              {autoUpdate ? 'Tự động: BẬT' : 'Tự động: TẮT'}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Trang sẽ tự động cập nhật dữ liệu sau mỗi 30 giây khi bật chế độ tự động
        </p>
      </CardContent>
    </Card>
  );
}

