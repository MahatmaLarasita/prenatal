// Database Nutrisi (Kadar per 100 gram BDD)
// Sumber: TKPI Kemenkes, Siloam Hospitals, & Halodoc
const nutritionDatabase = [
    // Protein Hewani
    { name: "Hati Ayam (100g)", folic: 588, iron: 9.0 },
    { name: "Hati Sapi (100g)", folic: 250, iron: 8.0 },
    { name: "Daging Sapi (100g)", folic: 12, iron: 2.8 },
    { name: "Kuning Telur Ayam (1 Btr)", folic: 146, iron: 2.7 },
    { name: "Telur Ayam Utuh (1 Btr)", folic: 45, iron: 1.2 },
    
    // Ikan & Seafood
    { name: "Kerang (100g)", folic: 16, iron: 21.0 },
    { name: "Ikan Bandeng (100g)", folic: 18, iron: 2.0 },
    { name: "Ikan Mas (100g)", folic: 17, iron: 1.3 },
    
    // Sayuran Hijau (Masak/Kukus)
    { name: "Bayam Masak (100g)", folic: 170, iron: 3.1 },
    { name: "Daun Kelor (100g)", folic: 40, iron: 7.0 },
    { name: "Brokoli Kukus (100g)", folic: 108, iron: 0.7 },
    { name: "Asparagus (100g)", folic: 149, iron: 2.1 },
    
    // Kacang-kacangan
    { name: "Kacang Hijau (100g)", folic: 625, iron: 6.7 },
    { name: "Kacang Merah (100g)", folic: 394, iron: 8.2 },
    { name: "Kacang Kedelai (100g)", folic: 375, iron: 15.7 },
    { name: "Tempe (100g)", folic: 52, iron: 4.0 },
    
    // Buah-buahan
    { name: "Alpukat (100g)", folic: 81, iron: 0.6 },
    { name: "Buah Bit (100g)", folic: 109, iron: 0.8 },
    { name: "Jeruk (1 buah)", folic: 30, iron: 0.1 },
    
    // Suplemen & Susu
    { name: "Tablet Tambah Darah (1 Tab)", folic: 400, iron: 60 },
    { name: "Susu Bumil (1 Gelas)", folic: 400, iron: 1.0 }
];

const fetalMilestones = {
    1: { phase: "Germinal", title: "Minggu 1-4: Implantasi", desc: "Sel mulai membelah diri menjadi embrio.", size: "0.1 mm" },
    14: { phase: "Fetal", title: "Minggu 14-27: Gerak Aktif", desc: "Janin aktif menendang dan indra pendengaran mulai aktif.", size: "25 - 35 cm" },
    28: { phase: "Fetal", title: "Minggu 28-40: Persiapan Lahir", desc: "Paru-paru matang dan posisi kepala mulai berputar ke bawah.", size: "45 - 50 cm" }
};

let currentFolic = 0;
let currentIron = 0;
let targetIronHarian = 18; // Default Trimester 1
const targetFolicHarian = 600; // Standar AKG per hari

function init() {
    const weekSel = document.getElementById('weekSelector');
    for(let i=1; i<=40; i++) {
        weekSel.options[weekSel.options.length] = new Option("Minggu ke-" + i, i);
    }

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
    
    // LOGIKA OTOMATIS: Target besi naik di Trimester 2 (Minggu 14+)
    targetIronHarian = (week >= 14) ? 27 : 18;

    const m = week >= 28 ? fetalMilestones[28] : (week >= 14 ? fetalMilestones[14] : fetalMilestones[1]);
    document.getElementById('fetalTitle').innerText = m.title;
    document.getElementById('fetalDesc').innerText = m.desc;
    document.getElementById('fetalSize').innerText = "Estimasi Ukuran: " + m.size;

    updateNutritionUI();
}

function addNutrition() {
    const foodIndex = document.getElementById('foodSelect').value;
    if(foodIndex == -1) return alert("Pilih menu makanan dulu ya, Bun!");

    const selectedFood = nutritionDatabase[foodIndex];
    currentFolic += selectedFood.folic;
    currentIron += selectedFood.iron;

    updateNutritionUI();
}

function updateNutritionUI() {
    const folicPercent = Math.min((currentFolic / targetFolicHarian) * 100, 100);
    const ironPercent = Math.min((currentIron / targetIronHarian) * 100, 100);

    document.getElementById('folicBar').style.width = folicPercent + "%";
    document.getElementById('ironBar').style.width = ironPercent + "%";
    
    // Penjelasan eksplisit agar tidak miskom: asupan vs target harian
    document.getElementById('folicStatus').innerText = `${currentFolic} / ${targetFolicHarian} mcg (Target Harian)`;
    document.getElementById('ironStatus').innerText = `${currentIron} / ${targetIronHarian} mg (Target Harian)`;
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
        res.innerHTML = `<div class="alert alert-danger"><b>Peringatan:</b><br>${errors.join('<br>')}<br><br><small>Mohon segera konsultasikan ke dokter kandungan.</small></div>`;
    } else {
        res.innerHTML = `<div class="alert alert-success">✅ Kondisi terpantau normal. Tetap jaga pola makan ya!</div>`;
    }
}

window.onload = init;
