// Data Kalender Perkembangan
const fetalData = {
    1: { title: "Fase Germinal", desc: "Pembuahan terjadi. Sel mulai membelah diri menjadi blastokista.", size: "Ukuran: Mikroskopis" },
    4: { title: "Pembentukan Organ", desc: "Jantung mulai berdetak dan sistem saraf pusat mulai terbentuk.", size: "Ukuran: Sebutir biji sesawi" },
    12: { title: "Wajah Mulai Terbentuk", desc: "Refleks bayi mulai berkembang, jari tangan dan kaki sudah terpisah.", size: "Ukuran: Sebutir jeruk nipis" }
    // Tambahkan minggu lainnya di sini
};

// 1. Fungsi Update Kalender
function initWeeks() {
    const select = document.getElementById('weekSelector');
    for(let i=1; i<=40; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = `Minggu ${i}`;
        select.appendChild(opt);
    }
}

function updateFetalInfo() {
    const week = document.getElementById('weekSelector').value;
    const info = fetalData[week] || { title: `Minggu ${week}`, desc: "Janin terus tumbuh dan menyempurnakan fungsi organ.", size: "Ukuran: Bertambah besar setiap hari" };
    
    document.getElementById('fetalTitle').innerText = info.title;
    document.getElementById('fetalDesc').innerText = info.desc;
    document.getElementById('fetalSize').innerText = info.size;
}

// 2. Fungsi Kalkulator Nutrisi (Sederhana)
let currentFolic = 0;
let currentIron = 0;

function addNutrition() {
    currentFolic += 100;
    currentIron += 5;
    
    document.getElementById('folicBar').style.width = (currentFolic/600 * 100) + "%";
    document.getElementById('ironBar').style.width = (currentIron/27 * 100) + "%";
    document.getElementById('folicStatus').innerText = `${currentFolic} / 600 mcg`;
    document.getElementById('ironStatus').innerText = `${currentIron} / 27 mg`;
}

// 3. Fungsi Deteksi Risiko
function checkRisk() {
    const sys = document.getElementById('systolic').value;
    const glu = document.getElementById('glucose').value;
    const resDiv = document.getElementById('riskResult');
    resDiv.classList.remove('d-none');

    let message = "";
    let alertClass = "";

    if (sys >= 140 || glu >= 200) {
        message = "<strong>Peringatan!</strong> Terdeteksi indikasi risiko tinggi (Hipertensi/Diabetes). Segera konsultasi ke dokter.";
        alertClass = "alert-danger";
    } else {
        message = "Kondisi tekanan darah dan gula darah terpantau normal.";
        alertClass = "alert-success";
    }

    resDiv.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
}

// Jalankan saat load
window.onload = initWeeks;