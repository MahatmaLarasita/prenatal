// Database Milestone sesuai WHO & Halodoc
const fetalMilestones = {
    1: { phase: "Germinal", title: "Minggu 1-4: Implantasi", desc: "Zigot menempel di dinding rahim. Sel mulai membelah diri menjadi embrio.", size: "0.1 mm" },
    5: { phase: "Embrionik", title: "Minggu 5-8: Pembentukan Organ", desc: "Tabung saraf menutup. Jantung mulai berdetak dan otak berkembang sangat pesat.", size: "2 - 5 mm" },
    9: { phase: "Fetal", title: "Minggu 9-13: Wajah & Gerak", desc: "Janin mulai bergerak secara refleks. Organ vital mulai berfungsi sempurna.", size: "6 - 7 cm" },
    14: { phase: "Fetal", title: "Minggu 14-27: Tendangan Aktif", desc: "Sistem saraf matang, janin aktif menendang, dan indra pendengaran mulai aktif.", size: "25 - 35 cm" },
    28: { phase: "Fetal", title: "Minggu 28-40: Persiapan Lahir", desc: "Paru-paru matang, tulang mengeras, dan posisi kepala berputar ke bawah.", size: "45 - 50 cm" }
};

let currentFolic = 0;
let currentIron = 0;

function init() {
    const sel = document.getElementById('weekSelector');
    for(let i=1; i<=40; i++) {
        sel.options[sel.options.length] = new Option("Minggu ke-" + i, i);
    }
    updateFetalInfo(); // Set default view
}

function updateFetalInfo() {
    const week = document.getElementById('weekSelector').value;
    const m = fetalMilestones[week] || 
             (week < 5 ? fetalMilestones[1] : 
              week < 9 ? fetalMilestones[5] : 
              week < 14 ? fetalMilestones[9] : 
              week < 28 ? fetalMilestones[14] : fetalMilestones[28]);

    document.getElementById('fetalTitle').innerText = m.title;
    document.getElementById('fetalPhase').innerText = m.phase;
    document.getElementById('fetalDesc').innerText = m.desc;
    document.getElementById('fetalSize').innerText = "Estimasi Panjang: " + m.size;
}

function addNutrition() {
    const data = document.getElementById('foodSelect').value.split(',');
    const fGain = parseInt(data[0]);
    const iGain = parseInt(data[1]);

    if(fGain === 0 && iGain === 0) return alert("Pilih menu makanan dulu ya!");

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

    if(isNaN(sys) || isNaN(glu)) return alert("Isi data tekanan darah dan gula darah ya, Bun.");

    let errors = [];
    // Standar WHO: Sistolik >= 140 (Hipertensi Gestasional)
    if(sys >= 140) errors.push("⚠️ Indikasi Hipertensi Gestasional (Sistolik ≥ 140 mmHg)");
    // Standar Klinis GDS >= 200 (Diabetes Gestasional)
    if(glu >= 200) errors.push("⚠️ Indikasi Diabetes Gestasional (GDS ≥ 200 mg/dL)");

    if(errors.length > 0) {
        res.innerHTML = `<div class="alert alert-danger"><b>Peringatan Medis:</b><br>${errors.join('<br>')}<br><br><small>Mohon segera konsultasikan ke dokter kandungan Bunda.</small></div>`;
    } else {
        res.innerHTML = `<div class="alert alert-success">✅ Kondisi saat ini terpantau normal. Tetap jaga pola makan dan istirahat ya!</div>`;
    }
}

window.onload = init;
