# PCB Defect Logger System

## 📌 เกี่ยวกับโปรเจค
ระบบบันทึกและติดตามจุดบกพร่องบนแผ่น PCB (Printed Circuit Board) 
พัฒนาด้วย ASP.NET Core Razor Pages และ SQLite

## 🎯 วัตถุประสงค์
- เพื่อฝึกทักษะการพัฒนา Web Application สำหรับอุตสาหกรรม
- เพื่อแสดงความเข้าใจเรื่องระบบ MES (Manufacturing Execution System)

## 🛠️ Technologies
- Backend: ASP.NET Core 10.0
- Database: SQLite + Entity Framework Core
- Frontend: HTML5, CSS3, JavaScript (Vanilla)

## ✨ ฟีเจอร์หลัก
- ✅ บันทึกตำแหน่ง defect แบบ Real-time
- ✅ แสดงผลแบบ Grid Map (10x10)
- ✅ แยกสีตามประเภท defect (Scratch/Solder/Missing)
- ✅ ระบบเลือกและจัดการ Lot Number
- ✅ Export ข้อมูลเป็น CSV
- ✅ ลบข้อมูลราย Lot

## 🚀 วิธีรันโปรแกรม
dotnet run
แล้วเปิด http://localhost:5000