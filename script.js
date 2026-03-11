// Database Makanan (Data per 100 gram BDD atau Porsi Standar)
// Sumber: Tabel Komposisi Pangan Indonesia (TKPI) & Referensi Klinis
const nutritionDatabase = [
    // Protein Hewani (Data per 100g)
    { name: "Hati Ayam (100g)", folic: 588, iron: 9.0 },
    { name: "Hati Sapi (100g)", folic: 250, iron: 8.0 },
    { name: "Kerang (100g)", folic: 16, iron: 21.0 },
    { name: "Daging Sapi (100g)", folic: 12, iron: 2.8 },
    { name: "Kuning Telur Ayam (1 Btr)", folic: 146, iron: 2.7 },
    { name: "Telur Ayam Utuh (1 Btr)", folic: 45, iron: 1.2 },
    
    // Ikan & Seafood (Data per 100g)
    { name: "Ikan Bandeng (100g)", folic: 18, iron: 2.0 },
    { name: "Ikan Mas (100g)", folic: 17, iron: 1.3 },
    
    // Sayuran & Kacang (Data per 100g)
    { name: "Bayam Masak (100g)", folic: 170, iron: 3.1 },
    { name: "Kacang Hijau (100g)", folic: 625, iron: 6.7 },
    { name: "Kacang Merah (100g)", folic: 394, iron: 8.2 },
    { name: "Kacang Kedelai Kering (100g)", folic: 375, iron: 15.7 },
    { name: "Daun Kelor (100g)", folic: 40, iron: 7.0 },
    { name: "Tempe (100g)", folic: 52, iron: 4.0 },
    
    // Buah (Data per 100g / Porsi)
    { name: "Alpukat (100g)", folic: 81, iron: 0.6 },
    { name: "Buah Bit (100g)", folic: 109, iron: 0.8 },
    { name: "Jeruk (1 buah)", folic: 30, iron: 0.1 },
    
    // Suplemen & Susu
    { name: "Tablet Tambah Darah (1 Tab)", folic: 400, iron: 60 },
    { name: "Susu Bumil (1 Gelas)", folic: 400, iron: 1.0 }
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
let targetIronHarian = 18; 
const targetFolicHarian = 600; 

function init() {
    // 1. Populasi Select Minggu
    const weekSel = document.getElementById('weekSelector');
    for(let i=1; i<=40; i++) {
        weekSel.options[weekSel.options.length] = new Option("Minggu ke-" + i, i);
    }

    // 2. Populasi Select Makanan
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

    document.getElementById('fetalTitle').innerText = m.title;
    document.getElementById('fetalPhase').innerText = m.phase;
    document.getElementById('fetalDesc').innerText = m.desc;
    document.getElementById('fetalSize').innerText = "Estimasi: " + m.size;

    // OTOMATIS: Target berubah saat masuk Minggu 14 (Trimester 2)
    targetIronHarian = (week >= 14) ? 27 : 18;
    
    updateNutritionUI();
}

function addNutrition() {
    const foodIndex = document.getElementById('foodSelect').value;
    if(foodIndex == -1) return alert("Pilih menu makanan dulu ya, Bun!");

    const selectedFood = nutritionDatabase[foodIndex];
    
    // Akumulasi tanpa melewati batas target (opsional, bisa dihapus jika ingin over-target)
    currentFolic = Math.min(currentFolic + selectedFood.folic, 2000); // Batas aman atas (UL)
    currentIron = Math.min(currentIron + selectedFood.iron, 45); // Batas aman atas (UL)

    updateNutritionUI();
}

function updateNutritionUI() {
    // Progress Bar menyesuaikan dengan targetIronHarian yang dinamis
    const folicPercent = Math.min((currentFolic / targetFolicHarian) * 100, 100);
    const ironPercent = Math.min((currentIron / targetIronHarian) * 100, 100);

    document.getElementById('folicBar').style.width = folicPercent + "%";
    document.getElementById('ironBar').style.width = ironPercent + "%";
    
    document.getElementById('folicStatus').innerText = `${currentFolic} / ${targetFolicHarian} mcg (Harian)`;
    document.getElementById('ironStatus').innerText = `${currentIron} / ${targetIronHarian} mg (Harian)`;
}

function checkRisk() {
    const sys = parseInt(document.getElementById('systolic').value);
    const glu = parseInt(document.getElementById('glucose').value);
    const res = document.getElementById('riskResult');

    if(isNaN(sys) || isNaN(glu)) return alert("Isi data tekanan darah dan gula darah ya, Bun.");

    let errors = [];
    if(sys >= 140) errors.push("⚠️ Indikasi Hipertensi Gestasional (Sistolik ≥ 140 mmHg)");
    if(glu >= 200) errors.push("⚠️ Indikasi Diabetes Gestasional (GDS ≥ 200 mg/dL)");

    if(errors.length > 0) {
        res.innerHTML = `<div class="alert alert-danger"><b>Peringatan Medis:</b><br>${errors.join('<br>')}<br><br><small>Mohon segera konsultasikan ke dokter kandungan Bunda.</small></div>`;
    } else {
        res.innerHTML = `<div class="alert alert-success">✅ Kondisi saat ini terpantau normal. Tetap jaga pola makan dan istirahat ya!</div>`;
    }
}

window.onload = init;
