# Classroom Management System - Modern React App

A modern, responsive classroom management system built with React, TypeScript, and Vite. This application monitors temperature, tracks occupancy, and controls classroom devices (lights and fans).

## ✨ Features

- **Real-time Monitoring**: Track temperature and occupancy in real-time
- **Device Control**: Toggle lights and fans remotely
- **Data Visualization**: Beautiful charts using Recharts
- **Historical Data**: Filter and view historical sensor data
- **Auto-refresh**: Automatic data updates every 30 seconds
- **Dark Mode**: Full dark mode support
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Modern UI**: Built with Tailwind CSS and custom components

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe code
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Powerful data fetching and caching
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## 🔧 Configuration

The API endpoint is configured in `src/services/api.ts`. Update the `API_BASE_URL` to match your backend:

```typescript
const API_BASE_URL = 'http://127.0.0.1/pbl31/tdt';
```

## 📱 Features Overview

### Dashboard Cards
- **Temperature Card**: Displays current temperature with update time
- **Occupancy Card**: Shows number of people in the room
- **Light Control**: Toggle classroom lights with visual feedback
- **Fan Control**: Control fan with spinning animation when active

### Data Filtering
- Filter historical data by date range
- Toggle auto-refresh on/off
- Visual indicators for active state

### Charts & Tables
- Line chart showing temperature and occupancy over time
- Sortable data table with device status
- Color-coded status indicators

### Dark Mode
- Toggle between light and dark themes
- Smooth transitions
- Persists across sessions

## 🎨 Design Features

- Modern gradient backgrounds
- Smooth animations and transitions
- Hover effects and interactive elements
- Responsive grid layouts
- Custom color schemes for light/dark modes
- Accessible UI components

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please open an issue in the repository.

