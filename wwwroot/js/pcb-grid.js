document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('pcb-grid');
    const lotSelect = document.getElementById('lotSelect');
    const newLotInput = document.getElementById('newLotInput');
    const defectList = document.getElementById('defect-list');
    const btnReset = document.getElementById('btnReset');
    const btnExport = document.getElementById('btnExport'); // ตัวแปรนี้มีแค่นี้ตัวเดียว
    const gridSize = 10;

    // 1. โหลดรายชื่อ Lot ทั้งหมดเมื่อเปิดเว็บ
    loadLotsList();

    // สร้าง Grid 10x10
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.textContent = `${x},${y}`;
            
            cell.addEventListener('click', async () => {
                // ใช้ค่าจาก Dropdown ถ้ามี ถ้าไม่มีใช้ค่าจาก Input
                let lot = lotSelect.value;
                if (!lot) lot = newLotInput.value.trim();

                if (!lot) { 
                    alert('กรุณาเลือก Lot หรือพิมพ์ Lot ใหม่ก่อน'); 
                    return; 
                }

                const defectType = prompt('ประเภทของเสีย (Scratch/Solder/Missing):', 'Scratch');
                if (!defectType) return;

                try {
                    const response = await fetch('/api/defects', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            lotNumber: lot,
                            gridX: x,
                            gridY: y,
                            defectType: defectType
                        })
                    });

                    if (response.ok) {
                        cell.classList.add(`defect-${defectType}`);
                        cell.title = `${defectType} at (${x},${y})`;
                        loadDefects(lot);
                        loadLotsList(); // อัปเดตรายชื่อ Lot เผื่อมี Lot ใหม่
                    } else if (response.status === 409) {
                        alert('จุดนี้ถูกบันทึกไปแล้ว!');
                    } else {
                        alert('เกิดข้อผิดพลาด');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            });

            grid.appendChild(cell);
        }
    }

    // 2. Event เมื่อเลือก Lot จาก Dropdown
    lotSelect.addEventListener('change', () => {
        const lot = lotSelect.value;
        if (lot) {
            newLotInput.value = ""; // เคลียร์ช่องพิมพ์
            loadDefects(lot);
            btnReset.style.display = "block"; // แสดงปุ่มลบ
            btnExport.style.display = "block"; // แสดงปุ่ม Export
        } else {
            clearGrid();
            btnReset.style.display = "none";
            btnExport.style.display = "none";
        }
    });

    // 3. Event เมื่อพิมพ์ Lot ใหม่
    newLotInput.addEventListener('input', () => {
        lotSelect.value = ""; // เคลียร์ Dropdown
        clearGrid();
        btnReset.style.display = "none";
        btnExport.style.display = "none";
    });

    // 4. Event ปุ่ม Reset (ลบข้อมูล)
    btnReset.addEventListener('click', async () => {
        const lot = lotSelect.value;
        if (!lot) return;

        if (confirm(`ต้องการลบข้อมูลทั้งหมดของ Lot: ${lot} ใช่หรือไม่?`)) {
            try {
                const response = await fetch(`/api/defects?lot=${encodeURIComponent(lot)}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    clearGrid();
                    loadLotsList(); // โหลด List ใหม่ (Lot นี้จะหายไปถ้าไม่มีข้อมูลอื่น)
                    alert('ลบข้อมูลเรียบร้อย');
                }
            } catch (error) {
                console.error('Error deleting:', error);
            }
        }
    });

    // 5. Event ปุ่ม Export CSV
    btnExport.addEventListener('click', () => {
        const lot = lotSelect.value;
        if (!lot) {
            alert('กรุณาเลือก Lot Number ก่อน');
            return;
        }

        // สร้าง CSV Content
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Lot Number,Grid X,Grid Y,Defect Type,Timestamp\n";
        
        // ดึงข้อมูลจากตาราง
        document.querySelectorAll('.grid-cell[class*="defect-"]').forEach(cell => {
            const x = cell.dataset.x;
            const y = cell.dataset.y;
            // ดึงชื่อ class ที่ขึ้นต้นด้วย defect- ออกมา
            const className = [...cell.classList].find(c => c.startsWith('defect-'));
            const type = className ? className.replace('defect-', '') : 'Unknown';
            
            csvContent += `${lot},${x},${y},${type},${new Date().toISOString()}\n`;
        });

        // สร้าง Link ดาวน์โหลด
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${lot}_Defects.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // --- Functions ---

    async function loadLotsList() {
        try {
            const res = await fetch('/api/lots');
            const lots = await res.json();
            
            // จดจำค่าที่เลือกไว้ก่อนหน้า
            const currentVal = lotSelect.value;

            lotSelect.innerHTML = '<option value="">-- เลือก Lot Number --</option>';
            lots.forEach(lot => {
                const option = document.createElement('option');
                option.value = lot;
                option.textContent = lot;
                lotSelect.appendChild(option);
            });

            // คืนค่าที่เลือก
            if (currentVal && lots.includes(currentVal)) {
                lotSelect.value = currentVal;
            }
        } catch (error) {
            console.error('Error loading lots:', error);
        }
    }

    async function loadDefects(lot) {
        if (!lot) return;
        
        try {
            const res = await fetch(`/api/defects?lot=${lot}`);
            const defects = await res.json();
            
            clearGrid();

            defects.forEach(d => {
                const cell = document.querySelector(`.grid-cell[data-x="${d.gridX}"][data-y="${d.gridY}"]`);
                if (cell) {
                    cell.classList.add(`defect-${d.defectType}`);
                    cell.title = `${d.defectType} at (${d.gridX},${d.gridY})`;
                }
                
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = `(${d.gridX},${d.gridY}) - ${d.defectType}`;
                defectList.appendChild(li);
            });
        } catch (error) {
            console.error('Error loading defects:', error);
        }
    }

    function clearGrid() {
        document.querySelectorAll('.grid-cell').forEach(c => {
            c.className = 'grid-cell'; // คืนค่า class
            c.title = '';
        });
        defectList.innerHTML = '';
    }
});