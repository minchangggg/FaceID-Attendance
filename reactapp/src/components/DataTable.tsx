import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import type { SensorData } from '@/types/api';
import { formatDateTime } from '@/lib/utils';

interface DataTableProps {
  data: SensorData[];
}

export function DataTable({ data }: DataTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bảng dữ liệu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b bg-muted/50">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Thời gian
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Nhiệt độ (°C)
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Số người
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Quạt
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Đèn
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="h-24 text-center text-muted-foreground">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4 align-middle">{formatDateTime(row.update_time)}</td>
                    <td className="p-4 align-middle">{row.temperature.toFixed(1)}</td>
                    <td className="p-4 align-middle">{row.number_people}</td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          row.fan_status
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {row.fan_status ? 'BẬT' : 'TẮT'}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          row.light_status
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {row.light_status ? 'BẬT' : 'TẮT'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

