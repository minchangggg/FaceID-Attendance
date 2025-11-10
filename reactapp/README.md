# FaceID Attendance System - React Frontend

A modern, responsive web application for viewing and managing FaceID attendance records.

## Features

- **Real-time Attendance Viewing**: View student attendance logs with automatic refresh every 30 seconds
- **Date Filtering**: Filter attendance records by specific date
- **Search Functionality**: Search students by name or student ID
- **Statistics Dashboard**: View total students, check-ins, and system status
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Prerequisites

- Node.js 16+ and npm/yarn
- FaceID FastAPI server running on `http://localhost:8000`

## Installation

1. Navigate to the reactapp directory:

```bash
cd reactapp
```

2. Install dependencies:

```bash
npm install
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
reactapp/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   ├── FilterSection.tsx    # Date and search filters
│   │   ├── StudentList.tsx      # Student attendance table
│   │   └── ThemeToggle.tsx      # Dark mode toggle
│   ├── services/
│   │   └── api.ts           # API service layer
│   ├── types/
│   │   └── api.ts           # TypeScript type definitions
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## API Integration

The application connects to the FastAPI backend at `http://localhost:8000` and uses the following endpoint:

- `GET /view-logs/` - Fetch all attendance logs
- `GET /view-logs/?date=YYYY-MM-DD` - Fetch attendance logs for a specific date

### Response Format

**All logs (no date parameter):**
```json
{
  "date": null,
  "records": [
    {
      "id": 1,
      "name": "Nguyen Van A",
      "student_id": "SV001",
      "timestamp": "2024-11-10T08:30:00"
    },
    {
      "id": 2,
      "name": "Tran Thi B",
      "student_id": "SV002",
      "timestamp": "2024-11-09T09:15:00"
    }
  ]
}
```

**Specific date:**
```json
{
  "date": "2024-11-10",
  "records": [
    {
      "id": 1,
      "name": "Nguyen Van A",
      "student_id": "SV001",
      "timestamp": "2024-11-10T08:30:00"
    }
  ]
}
```

## Configuration

To change the API base URL, edit `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8000';
```

## Features in Detail

### Date Filtering
- Leave date empty to view **all attendance records** from all dates
- Select any date to view attendance records for that specific day
- Click "Hôm nay" (Today) button for quick access to today's records
- Click the "X" button to clear the date filter and view all records

### Search
- Search by student name or student ID
- Real-time filtering as you type
- Case-insensitive search

### Statistics
- **Tổng sinh viên**: Total unique students who checked in
- **Lượt điểm danh**: Total check-in count
- **Trạng thái**: System status indicator

### Dark Mode
- Toggle between light and dark themes
- Preference persists during session
- Smooth transitions between themes

## Development

### Code Style
- Use meaningful variable names
- Keep functions under 30 lines
- Add type annotations for all props and functions
- Follow React best practices

### Adding New Features

1. Create new components in `src/components/`
2. Add API functions in `src/services/api.ts`
3. Define types in `src/types/api.ts`
4. Update this README with new features

## Troubleshooting

### API Connection Issues
- Ensure FastAPI server is running on `http://localhost:8000`
- Check CORS settings in the FastAPI server
- Verify network connectivity

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## License

MIT License - See main project README for details
