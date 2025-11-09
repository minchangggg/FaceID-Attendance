import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import type { SensorData } from '@/types/api';
import { format } from 'date-fns';

interface DataChartProps {
  data: SensorData[];
}

export function DataChart({ data }: DataChartProps) {
  const chartData = data.map((item) => ({
    time: format(new Date(item.update_time), 'HH:mm'),
    temperature: item.temperature,
    people: item.number_people,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biểu đồ dữ liệu</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="time"
              className="text-xs"
              stroke="currentColor"
            />
            <YAxis className="text-xs" stroke="currentColor" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#ef4444"
              strokeWidth={2}
              name="Nhiệt độ (°C)"
              dot={{ fill: '#ef4444' }}
            />
            <Line
              type="monotone"
              dataKey="people"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Số người"
              dot={{ fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

