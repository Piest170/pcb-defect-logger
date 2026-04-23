# PCB Defect Logger System

## 📌 Overview
A web-based application for tracking and logging defects on Printed Circuit Boards (PCB). Developed using ASP.NET Core Razor Pages and SQLite for efficient manufacturing quality control.

## 🎯 Objectives
- To demonstrate web application development skills for industrial use
- To showcase understanding of MES (Manufacturing Execution System) concepts
- To provide a practical tool for defect tracking and analysis

## 🛠️ Technologies Used
- **Backend:** ASP.NET Core 10.0 (C#)
- **Database:** SQLite with Entity Framework Core
- **Frontend:** HTML5, CSS3, Bootstrap 5, Vanilla JavaScript
- **Visualization:** Chart.js for data analytics
- **Architecture:** Razor Pages + Minimal API

## ✨ Features

### Core Functionality
- ✅ Real-time defect logging on interactive 10x10 grid map
- ✅ Color-coded defect visualization by type (Scratch/Solder/Missing)
- ✅ Lot Number management system with dropdown selection
- ✅ Historical data retrieval and display
- ✅ CSV data export for further analysis
- ✅ Batch deletion by Lot Number
- ✅ Duplicate prevention (same position in same lot)

### Analytics & Reporting
- 📊 Pie chart showing defect distribution by type
- 📈 Bar chart displaying defect frequency by row position
- 📉 Real-time statistics (Total defects, Yield rate, Most common defect)
- 💾 Export defect data to CSV format

### User Interface
- 🎨 Responsive design (Bootstrap 5)
- 🖱️ Interactive grid-based defect mapping
- 📱 Mobile-friendly layout
- 🎯 Intuitive and user-friendly interface

## 📋 Prerequisites
- .NET 8.0 or later
- Visual Studio Code or Visual Studio 2022
- Modern web browser (Chrome, Edge, Firefox)

<img width="1898" height="867" alt="image" src="https://github.com/user-attachments/assets/ff9b459e-dfa6-4d49-9292-30c0fa71529a" />
<img width="1897" height="780" alt="image" src="https://github.com/user-attachments/assets/bf59af58-4abd-4bf0-8552-4d15428c56da" />

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/pcb-defect-logger.git
cd pcb-defect-logger
