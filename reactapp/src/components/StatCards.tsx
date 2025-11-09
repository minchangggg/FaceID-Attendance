import { Thermometer, Users, Lightbulb, Fan } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/utils';
import type { SensorData } from '@/types/api';

interface StatCardProps {
  data: SensorData | null;
  onToggleFan: () => void;
  onToggleLight: () => void;
  isLoading?: boolean;
}

export function StatCards({ data, onToggleFan, onToggleLight, isLoading }: StatCardProps) {
  const cards = [
    {
      title: 'Nhiệt độ',
      value: data ? `${data.temperature.toFixed(1)}°C` : 'N/A',
      icon: Thermometer,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950',
      subtitle: data ? `Cập nhật: ${formatTime(data.update_time)}` : 'Đang tải...',
    },
    {
      title: 'Số người',
      value: data ? data.number_people : 'N/A',
      unit: 'người',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      subtitle: data ? `Cập nhật: ${formatTime(data.update_time)}` : 'Đang tải...',
    },
  ];

  const fanActive = data?.fan_status === 1;
  const lightActive = data?.light_status === 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn('p-3 rounded-lg', card.bgColor)}>
                  <Icon className={cn('h-6 w-6', card.color)} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold">
                    {isLoading ? '...' : card.value}
                  </p>
                  {card.unit && <span className="text-sm text-muted-foreground">{card.unit}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Light Control Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              'p-3 rounded-lg transition-colors',
              lightActive ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-gray-100 dark:bg-gray-800'
            )}>
              <Lightbulb className={cn(
                'h-6 w-6 transition-all',
                lightActive ? 'text-yellow-500 animate-pulse-glow' : 'text-gray-400'
              )} />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Đèn</p>
            <Button
              onClick={onToggleLight}
              variant={lightActive ? 'success' : 'outline'}
              className="w-full"
              disabled={isLoading}
            >
              {lightActive ? 'BẬT' : 'TẮT'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {lightActive ? 'Đang bật' : 'Tắt khi không người'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Fan Control Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              'p-3 rounded-lg transition-colors',
              fanActive ? 'bg-cyan-100 dark:bg-cyan-900' : 'bg-gray-100 dark:bg-gray-800'
            )}>
              <Fan className={cn(
                'h-6 w-6 transition-all',
                fanActive ? 'text-cyan-500 animate-spin-slow' : 'text-gray-400'
              )} />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Quạt</p>
            <Button
              onClick={onToggleFan}
              variant={fanActive ? 'success' : 'outline'}
              className="w-full"
              disabled={isLoading}
            >
              {fanActive ? 'BẬT' : 'TẮT'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {fanActive ? 'Đang chạy' : 'Tắt khi nhiệt cao'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

