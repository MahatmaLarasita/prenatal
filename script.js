// Database Perkembangan Janin (Standard WHO & Halodoc)
const fetalMilestones = {
    1: { phase: "Germinal", title: "Minggu 1-4: Implantasi", desc: "Sel mulai menempel di rahim. Ukuran mikroskopis.", size: "0.1 mm" },
    5: { phase: "Embrionik", title: "Minggu 5-8: Detak Jantung", desc: "Tabung saraf menutup, jantung mulai berdetak.", size: "2 - 5 mm" },
    9: { phase: "Fetal", title: "Minggu 9-13: Pembentukan Wajah", desc: "Janin mulai bergerak, wajah dan jari mulai terlihat.", size: "6 cm" },
    14: { phase: "Fetal", title: "Minggu 14-27: Aktif Menendang", desc: "Jenis kelamin dapat dideteksi. Pendengaran berkembang.", size: "25 cm" },
    28: { phase: "Fetal", title: "Minggu 28-40: Kematangan Paru", desc: "Berat badan naik pesat. Persiapan posisi lahir.", size: "50 cm" }
};

let currentFolic = 0;
let currentIron = 0;

function init() {
    const sel = document.getElementById('weekSelector');
    for(let i=1; i<=40; i++) {
        sel.options[sel.options.length] = new Option("Minggu ke-" + i, i);
    }
}

function updateFetalInfo() {
    const week = document.getElementById('weekSelector').value;
    // Cari milestone terdekat atau gunakan default
    const m = fetalMilestones[week] || 
             (week < 5 ? fetalMilestones[1] : 
              week < 9 ? fetalMilestones[5] : 
              week < 14 ? fetalMilestones[9] : 
              week < 28 ? fetalMilestones[14] : fetalMilestones[28]);

    document.getElementById('fetalTitle').innerText = `Minggu ${week}: ${m.title.split(': ')[1] || m.title}`;
    document.getElementById('fetalPhase').innerText = m.phase;
    document.getElementById('fetalDesc').innerText = m.desc;
    document.getElementById('fetalSize').innerHTML = `<i class="fas fa-ruler"></i> Ukuran: ${m.size}`;
}

function addNutrition() {
    const data = document.getElementById('foodSelect').value.split(',');
    const fGain = parseInt(data[0]);
    const iGain = parseInt(data[1]);

    if(fGain === 0) return alert("Pilih menu makanan dulu ya, Bun!");

    currentFolic = Math.min(currentFolic + fGain, 600);
    currentIron = Math.min(currentIron + iGain, 27);

    document.getElementById('folicBar').style.width = (currentFolic/600 * 100) + "%";
    document.getElementById('ironBar').style.width = (currentIron/27 * 100) + "%";
    document.getElementById('folicStatus').innerText = `${currentFolic} / 600 mcg`;
    document.getElementById('ironStatus').innerText = `${currentIron} / 27 mg`;
}

function checkRisk() {
    const sys = parseInt(document.getElementById('systolic').value);
    const glu = parseInt(document.getElementById('glucose').value);
    const res = document.getElementById('riskResult');

    if(isNaN(sys) || isNaN(glu)) return alert("Mohon lengkapi data tekanan darah & gula darah.");

    let warnings = [];
    // Standar WHO: Sistolik >= 140 mmHg (Hipertensi Gestasional)
    if(sys >= 140) warnings.push("⚠️ Indikasi Hipertensi Gestasional (Standar WHO: Sistolik < 140 mmHg).");
    // Standar Klinis: GDS >= 200 mg/dL (Diabetes Gestasional)
    if(glu >= 200) warnings.push("⚠️ Indikasi Diabetes Gestasional (Standar GDS < 200 mg/dL).");

    if(warnings.length > 0) {
        res.innerHTML = `<div class="alert alert-warning">${warnings.join('<br>')} <br><b>Saran:</b> Segera konsultasi ke dokter spesialis Obsgyn.</div>`;
    } else {
        res.innerHTML = `<div class="alert alert-safe">✅ Data Bunda terpantau normal sesuai standar klinis saat ini. Tetap jaga pola hidup sehat!</div>`;
    }
}

window.onload = init;
