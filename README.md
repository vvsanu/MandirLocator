# BAPS Temple Finder

A comprehensive web application for finding BAPS temples across North America with interactive mapping and location-based search capabilities.

## Features

- 🔍 **Smart Search**: Find temples by zip code or current location
- 🗺️ **Interactive Map**: Toggle between list and map views with custom BAPS logo markers
- 📱 **Mobile Optimized**: iOS and Android friendly with touch-optimized interface
- 📍 **Location Services**: GPS-based temple discovery with distance calculations
- 🏛️ **Comprehensive Database**: All BAPS temples across North America
- 📞 **Contact Information**: Phone numbers, addresses, and operating hours

## Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation & Running

1. **Extract the downloaded files**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Or use the convenience script:
   ```bash
   node dev.js
   ```
4. **Open your browser to:**
   - Primary: http://localhost:5000
   - If port 5000 is busy: http://localhost:5001

## Mobile Usage (iOS)

For the best iOS experience:
1. Open the app in Safari
2. Tap the "Share" button
3. Select "Add to Home Screen"
4. Use as a native-like app

The app includes iOS-specific optimizations:
- Numeric keyboard for zip code input
- Touch-friendly button sizing
- Optimized map gestures
- Prevention of unwanted zoom on input focus

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Maps**: Leaflet with react-leaflet
- **Build Tool**: Vite
- **UI Components**: Shadcn/ui with Radix UI

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking

## Project Structure

```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # App pages
│   │   ├── lib/          # Utilities
│   │   └── hooks/        # React hooks
├── server/               # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data management
├── shared/               # Shared types and schemas
└── attached_assets/      # Temple data and logos
```

## Support

For questions or support, contact the development team:
- **Anssh Prajapati** - ansshprajapati11@gmail.com
- **Pujan Patel** - pujanpatel.2004@gmail.com  
- **Shail Patel** - shailpatel.2003@gmail.com

## About BAPS

Visit [baps.org](https://baps.org) to learn more about BAPS Swaminarayan Sanstha and find information about events, programs, and spiritual activities.