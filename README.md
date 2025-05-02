# 🚀 Galactic Vessels Explorer

A modern React application for exploring, filtering, and comparing starships from the Star Wars universe using the SWAPI (Star Wars API).



## ✨ Features

- **Browse Starships**: View a comprehensive list of Star Wars vessels with key information
- **Advanced Filtering**: Filter vessels by name, model, speed, crew size, and manufacturer
- **Detailed Information**: Explore in-depth specifications, capacity details, and related data
- **Favorites System**: Save your favorite vessels for quick access
- **Comparison Tool**: Compare up to three vessels side by side to see which performs best
- **Responsive Design**: Seamlessly works on all device sizes from mobile to desktop

## 🛠️ Technologies Used

- **React 19**: Latest React version with enhanced performance
- **React Router 7**: For seamless navigation and routing
- **Context API**: For state management (favorites system)
- **CSS Variables**: For consistent theming and styling
- **Fetch API**: For data retrieval from SWAPI
- **ES6+ JavaScript**: Modern JavaScript features and syntax

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Header.jsx              # Navigation and app header
│   ├── VesselList.jsx          # Main list of vessels with filtering
│   ├── VesselCard.jsx          # Individual vessel card component
│   ├── FilterPanel.jsx         # Advanced filtering options
│   ├── VesselDetail.jsx        # Detailed vessel information page
│   ├── Favorites.jsx           # Favorited vessels page
│   ├── CompareVessels.jsx      # Vessel comparison tool
│   ├── LoadingSpinner.jsx      # Loading state component
│   ├── ErrorMessage.jsx        # Error display component
│   └── NotFound.jsx            # 404 page
├── styles/                     # Separated CSS files for components
├── App.jsx                     # Main app component with routes
└── main.jsx                    # Entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/galactic-vessels-explorer.git
   cd galactic-vessels-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🔍 Key Features In Detail

### Advanced Filtering System

The app provides comprehensive filtering capabilities:
- **Text Search**: Filter by vessel name or model in real-time
- **Speed Range**: Filter vessels by minimum and maximum atmospheric speed
- **Crew Size**: Filter by minimum and maximum crew requirements
- **Manufacturer**: Find vessels from specific manufacturers

### Vessel Classification

Vessels are automatically categorized based on their size:
- **Small**: < 50 meters (🛸)
- **Medium**: 50-300 meters (🚀)
- **Large**: 300-1000 meters (🛰️)
- **Capital**: > 1000 meters (🌌)
- **Unknown**: Size data unavailable (❓)

### Favorites System

- Add vessels to favorites with a single click
- Dedicated favorites page for quick access
- Favorites count displayed in the navigation
- Easily remove vessels from favorites

### Comparison Tool

- Side-by-side comparison of up to three vessels
- Visual highlighting of superior specifications
- Easy addition/removal of vessels from comparison
- Relevant metrics for meaningful comparison

## 🔄 API Integration

This application uses the Star Wars API (SWAPI) to fetch vessel data:
- Base URL: `https://swapi.dev/api/`
- Endpoints used:
  - `/starships/` - For listing vessels
  - `/starships/{id}/` - For vessel details
  - Related endpoints for pilots and films

## 📱 Responsive Design

The app is designed to work seamlessly across different device sizes:
- **Desktop**: Optimized grid layout and detailed information
- **Tablet**: Adjusted layouts for medium-sized screens
- **Mobile**: Single-column layouts and optimized navigation

## 🧩 Future Enhancements

Potential features for future versions:
- User accounts with persistent favorites
- Sorting options for vessel lists
- Additional data visualization (charts, graphs)
- Dark/light theme toggle
- Offline support with service workers
- Related planets and species information

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Star Wars API (SWAPI)](https://swapi.dev/) for providing the data
- The Star Wars franchise and Lucasfilm
- React and the community for excellent tools and documentation