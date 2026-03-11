// Database Makanan (Simulasi JSON Database)
// Sumber: TKPI Kemenkes & USDA Standard
const nutritionDatabase = [
    { name: "Susu Kehamilan (1 Gelas)", folic: 400, iron: 1, cal: 150 },
    { name: "Bayam Masak (1 Mangkok)", folic: 194, iron: 3, cal: 40 },
    { name: "Tablet Tambah Darah (1 Tab)", folic: 20, iron: 15, cal: 0 },
    { name: "Hati Ayam (1 Potong)", folic: 150, iron: 2, cal: 116 },
    { name: "Alpukat (1 Buah)", folic: 80, iron: 0.6, cal: 160 },
    { name: "Telur Rebus (1 Butir)", folic: 22, iron: 1.2, cal: 78 },
    { name: "Jeruk (1 Buah)", folic: 30, iron: 0.1, cal: 62 },
    { name: "Kacang Hijau (1 Mangkok)", folic: 200, iron: 1.4, cal: 212 }
];

const fetalMilestones = {
    1: { phase: "Germinal", title: "Minggu 1-4: Implantasi", desc: "Zigot menempel di dinding rahim. Sel mulai membelah diri menjadi embrio.", size: "0.1 mm (Butiran Debu)" },
    5: { phase: "Embrionik", title: "Minggu 5-8: Pembentukan Organ", desc: "Tabung saraf menutup. Jantung mulai berdetak dan otak berkembang pesat.", size: "2 - 5 mm (Biji Wijen)" },
    9: { phase: "Fetal", title: "Minggu 9-13: Wajah & Gerak", desc: "Janin mulai bergerak secara refleks. Organ vital mulai berfungsi.", size: "6 - 7 cm (Jeruk Nipis)" },
    14: { phase: "Fetal", title: "Minggu 14-27: Tendangan Aktif", desc: "Sistem saraf matang, janin aktif menendang, indra pendengaran aktif.", size: "25 - 35 cm (Terong)" },
    28: { phase: "Fetal", title: "Minggu 28-40: Persiapan Lahir", desc: "Paru-paru matang, tulang mengeras, posisi kepala berputar ke bawah.", size: "45 - 50 cm (Semangka)" }
};

// Variabel Penampung Progress
let currentFolic = 0;
let currentIron = 0;
let targetIronHarian = 18; // Default Trimester 1
const targetFolicHarian = 600; // Standar Tetap PMK 2019

function init() {
    // 1. Populasi Select Minggu
    const weekSel = document.getElementById('weekSelector');
    for(let i=1; i<=40; i++) {
        weekSel.options[weekSel.options.length] = new Option("Minggu ke-" + i, i);
    }

    // 2. Populasi Select Makanan dari Database
    const foodSel = document.getElementById('foodSelect');
    foodSel.innerHTML = '<option value="-1">-- Pilih Menu Makanan --</option>';
    nutritionDatabase.forEach((item, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.text = item.name;
        foodSel.appendChild(option);
    });

    updateFetalInfo(); 
}

function updateFetalInfo() {
    const week = parseInt(document.getElementById('weekSelector').value);
    const m = fetalMilestones[week] || 
             (week < 5 ? fetalMilestones[1] : 
              week < 9 ? fetalMilestones[5] : 
              week < 14 ? fetalMilestones[9] : 
              week < 28 ? fetalMilestones[14] : fetalMilestones[28]);

    // Update UI Milestone
    document.getElementById('fetalTitle').innerText = m.title;
    document.getElementById('fetalPhase').innerText = m.phase;
    document.getElementById('fetalDesc').innerText = m.desc;
    document.getElementById('fetalSize').innerText = "Estimasi: " + m.size;

    // Logika Penyesuaian Target Zat Besi (PMK No. 28 Tahun 2019)
    // Trimester 1 (Minggu 1-13) = 18mg, Trimester 2 & 3 (Minggu 14-40) = 27mg
    targetIronHarian = (week >= 14) ? 27 : 18;
    
    // Refresh Tampilan Progress Bar agar skala-nya sesuai target baru
    updateNutritionUI();
}

function addNutrition() {
    const foodIndex = document.getElementById('foodSelect').value;
    
    if(foodIndex == -1) return alert("Pilih menu makanan dulu ya, Bun!");

    const selectedFood = nutritionDatabase[foodIndex];
    
    currentFolic = Math.min(currentFolic + selectedFood.folic, targetFolicHarian);
    currentIron = Math.min(currentIron + selectedFood.iron, targetIronHarian);

    updateNutritionUI();
}

function updateNutritionUI() {
    // Update Infografis (Progress Bars) berdasarkan target dinamis
    const folicPercent = (currentFolic / targetFolicHarian) * 100;
    const ironPercent = (currentIron / targetIronHarian) * 100;

    document.getElementById('folicBar').style.width = folicPercent + "%";
    document.getElementById('ironBar').style.width = ironPercent + "%";
    
    document.getElementById('folicStatus').innerText = `${currentFolic} / ${targetFolicHarian} mcg`;
    document.getElementById('ironStatus').innerText = `${currentIron} / ${targetIronHarian} mg`;
}

function checkRisk() {
    const sys = parseInt(document.getElementById('systolic').value);
    const glu = parseInt(document.getElementById('glucose').value);
    const res = document.getElementById('riskResult');

    if(isNaN(sys) || isNaN(glu)) return alert("Isi data tekanan darah dan gula darah ya, Bun.");

    let errors = [];
    // Standar WHO & Kemenkes
    if(sys >= 140) errors.push("⚠️ Indikasi Hipertensi Gestasional (Sistolik ≥ 140 mmHg)");
    if(glu >= 200) errors.push("⚠️ Indikasi Diabetes Gestasional (GDS ≥ 200 mg/dL)");

    if(errors.length > 0) {
        res.innerHTML = `<div class="alert alert-danger"><b>Peringatan Medis:</b><br>${errors.join('<br>')}<br><br><small>Mohon segera konsultasikan ke dokter kandungan Bunda.</small></div>`;
    } else {
        res.innerHTML = `<div class="alert alert-success">✅ Kondisi saat ini terpantau normal. Tetap jaga pola makan dan istirahat ya!</div>`;
    }
}

window.onload = init;
