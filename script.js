const fetalData = {
    1: { title: "Minggu 1-3", desc: "Awal pembuahan. Sel mulai membelah diri.", size: "Ukuran: Butiran Debu" },
    4: { title: "Minggu 4", desc: "Embrio menempel di rahim. Jantung mulai terbentuk.", size: "Ukuran: Biji Wijen" },
    8: { title: "Minggu 8", desc: "Hidung dan jari-jari kecil mulai terlihat.", size: "Ukuran: Buah Raspberry" },
    12: { title: "Minggu 12", desc: "Janin sudah bisa bergerak sedikit.", size: "Ukuran: Buah Lemon" },
    20: { title: "Minggu 20", desc: "Saraf pendengaran mulai berfungsi.", size: "Ukuran: Buah Pisang" }
};

function init() {
    const sel = document.getElementById('weekSelector');
    if(sel) {
        for(let i=1; i<=40; i++) {
            sel.options[sel.options.length] = new Option("Minggu ke-" + i, i);
        }
    }
}

function updateFetalInfo() {
    const w = document.getElementById('weekSelector').value;
    const d = fetalData[w] || { title: "Minggu "+w, desc: "Janin terus berkembang pesat.", size: "Ukuran: Terus bertambah" };
    
    document.getElementById('fetalTitle').innerText = d.title;
    document.getElementById('fetalDesc').innerText = d.desc;
    document.getElementById('fetalSize').innerText = d.size;
}

let f = 0, i = 0;
function addNutrition() {
    f = Math.min(f + 100, 600); 
    i = Math.min(i + 5, 27);
    document.getElementById('folicBar').style.width = (f/600*100)+'%';
    document.getElementById('ironBar').style.width = (i/27*100)+'%';
    document.getElementById('folicStatus').innerText = f + "/600";
    document.getElementById('ironStatus').innerText = i + "/27";
}

function checkRisk() {
    const sys = document.getElementById('systolic').value;
    const glu = document.getElementById('glucose').value;
    const res = document.getElementById('riskResult');
    
    if(!sys || !glu) { alert("Isi datanya dulu ya, Bun!"); return; }

    if(sys >= 140 || glu >= 200) {
        res.innerHTML = `<div class="alert alert-danger"><b>Perhatian:</b> Ada indikasi risiko kesehatan. Sebaiknya segera konsultasi ya.</div>`;
    } else {
        res.innerHTML = `<div class="alert alert-safe"><b>Normal:</b> Kondisi Bunda terpantau baik. Tetap jaga pola makan ya!</div>`;
    }
}

window.onload = init;
