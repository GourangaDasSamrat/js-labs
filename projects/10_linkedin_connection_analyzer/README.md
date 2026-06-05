# LinkedIn Connection Analyzer

A web-based tool to visualize and analyze your LinkedIn connections data with interactive charts and insights.

## What This App Does

- **Upload & Parse**: Import your LinkedIn Connections CSV file
- **Analyze**: Categorize connections by profession, company, and timeline
- **Visualize**: Interactive charts showing:
  - Profession distribution (Frontend, Backend, AI/ML, DevOps, etc.)
  - Monthly connection growth over time
  - Top 15 companies by connection count
  - Recent connections table

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charts**: [Chart.js](https://www.chartjs.org/) v4.4.1
- **CSV Parsing**: [PapaParse](https://www.papaparse.com/) v5.4.1
- **Typography**: Google Fonts (DM Mono, Syne)

## How to Use

1. Export your LinkedIn connections:
   - Go to Settings → Data Privacy → Get a copy of your data → Connections
   - Download the `Connections.csv` file

2. Open the app in your browser

3. Upload the CSV file by dragging and dropping or clicking the upload zone

4. View your connection analytics in the dashboard

## Features

- Dark theme with gradient UI
- Responsive design
- Real-time chart rendering
- Automatic role classification based on job titles
- Tech company highlighting
