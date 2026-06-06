# LinkedIn Connection Analyzer

A web-based tool to visualize and analyze your LinkedIn connections data with interactive charts and insights. Features a two-page interface with detailed analytics and an advanced connections browser.

🚀 **[Live Demo](https://gourangadassamrat.github.io/js-labs/projects/10_linkedin_connection_analyzer/)**

## What This App Does

- **Upload & Parse**: Import your LinkedIn Connections CSV file
- **Analyze**: Categorize connections by profession, company, and timeline
- **Visualize**: Interactive charts showing:
  - Profession distribution (Frontend, Backend, AI/ML, DevOps, etc.)
  - Monthly connection growth over time
  - Top 15 companies by connection count
- **Browse**: Search and filter connections with advanced sorting options

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charts**: [Chart.js](https://www.chartjs.org/) v4.4.1
- **CSV Parsing**: [PapaParse](https://www.papaparse.com/) v5.4.1
- **Search**: [Fuse.js](https://fusejs.io/) v7.0.0 (fuzzy search)
- **Icons**: [Font Awesome](https://fontawesome.com/) v6.5.1
- **Typography**: Google Fonts (DM Mono, Syne)

## How to Use

### For Analysis

1. Export your LinkedIn connections:
   - Go to Settings → Data Privacy → Get a copy of your data → Connections
   - Download the `Connections.csv` file

2. Open the app in your browser

3. On the home page, click **"Start Analysis"**

4. Upload the CSV file by dragging and dropping or clicking the upload zone

5. View your connection analytics:
   - **Analysis Page**: Overview with statistics and charts
   - **Connections Page**: Browse and filter all connections

### For Comparing Exports

1. Export two different LinkedIn connection snapshots:
   - First export: Your connections from a previous date
   - Second export: Your current connections

2. Open the app and click **"Start Diff"** from the home page

3. Upload both CSV files to the diff tool

4. View a detailed comparison showing added, removed, and unchanged connections

## Features

### 🏠 Home Page

- **Mode Selection**: Choose between single file analysis or CSV file comparison
- **Quick Start**: Easy navigation cards for both workflows

### 📊 Analysis Page

- **Statistics Cards**: Total connections, Big Tech employees, Developers, AI/ML specialists
- **Profession Distribution**: Doughnut chart showing role breakdown
- **Growth Timeline**: Monthly connection growth visualization
- **Top Companies**: Horizontal bar chart of your top 15 companies

### 🔀 Diff Page

- **Dual File Upload**: Compare two CSV exports side-by-side
- **Change Summary**: View statistics on added, removed, and unchanged connections
- **Detailed Comparison**: See exactly which connections are new or have changed over time

### 🔗 Connections Page

- **Advanced Search**: Fuzzy search by name, position, or company
- **Smart Sorting**:
  - By Date (most recent first)
  - By Company (alphabetical)
  - By Name (A-Z)
- **View Modes**:
  - Recent (last 20 connections)
  - All (complete connection list)
- **Interactive Table**: Sortable connections with all details
- **No Results Handling**: Clear message when search yields no matches

### 🎨 User Experience

- Dark theme with gradient UI
- Responsive design for mobile and desktop
- Smooth page transitions
- Visual feedback on interactions
- Upload success confirmation
- "Upload New File" button for quick re-upload
- Developer information section with portfolio and social links

## File Structure

```
10_linkedin_connection_analyzer/
├── index.html          # Main HTML structure with two-page layout
├── main.js            # JavaScript logic for parsing, charts, and interactions
├── styles.css         # Complete styling and animations
├── README.md          # This file
└── img/              # Assets folder
```

## Key Functions

- `parseConnections()`: Parses LinkedIn CSV format
- `renderStats()`: Displays statistics cards
- `renderRoleChart()`: Doughnut chart of professions
- `renderGrowthChart()`: Monthly growth bar chart
- `renderCompanyChart()`: Top companies bar chart
- `filterConnections()`: Fuzzy search with Fuse.js
- `sortConnections()`: Multi-mode sorting
- `switchPage()`: Navigation between Analysis and Connections
- `resetApp()`: Reset and upload new file

## Data Privacy

- ✅ All processing happens in your browser
- ✅ No data sent to any server
- ✅ Your connections data remains private
- ✅ Works completely offline after loading

## Tips

- Your data is processed entirely in the browser - nothing is sent to servers
- Use the search to quickly find connections by skills or company
- Sort by company to identify key organizations in your network
- The role classifier recognizes 8 different profession types
- Big Tech companies are specially highlighted

## About

Created by **Gouranga Das Samrat**

- 🌐 [Portfolio](https://gouranga.eu.org)
- 💻 [GitHub](https://github.com/GourangaDasSamrat)
- 💼 [LinkedIn](https://www.linkedin.com/in/gouranga-das-samrat/)

## License

Licensed under the MIT License - see LICENSE file for details
