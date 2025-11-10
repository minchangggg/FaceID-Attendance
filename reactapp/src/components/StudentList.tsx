import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Users, Clock, User, Hash } from 'lucide-react';
import type { AttendanceLog } from '@/types/api';
import { formatDateTime } from '@/lib/utils';

interface StudentListProps {
  data: AttendanceLog[];
  isLoading?: boolean;
}

export function StudentList({ data, isLoading }: StudentListProps) {
  const uniqueStudents = data.reduce((acc, log) => {
    if (!acc.find(s => s.student_id === log.student_id)) {
      acc.push(log);
    }
    return acc;
  }, [] as AttendanceLog[]);

  const totalCheckIns = data.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng sinh viên</p>
                <p className="text-2xl font-bold">{uniqueStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <Clock className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lượt điểm danh</p>
                <p className="text-2xl font-bold">{totalCheckIns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
                <User className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trạng thái</p>
                <p className="text-2xl font-bold">{isLoading ? '...' : 'Hoạt động'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Danh sách sinh viên điểm danh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b bg-muted/50">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    #
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Mã sinh viên
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Họ và tên
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Thời gian điểm danh
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="h-24 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        Đang tải dữ liệu...
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="h-24 text-center text-muted-foreground">
                      Không có dữ liệu điểm danh
                    </td>
                  </tr>
                ) : (
                  data.map((log, index) => (
                    <tr
                      key={`${log.student_id}-${log.timestamp}`}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          {index + 1}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <span className="font-mono font-semibold text-primary">
                          {log.student_id}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-xs">
                            {log.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{log.name}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {formatDateTime(log.timestamp)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

