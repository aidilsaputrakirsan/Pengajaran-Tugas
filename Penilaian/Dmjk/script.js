document.addEventListener('DOMContentLoaded', function() {
  const url = 'https://script.google.com/macros/s/AKfycbzQbfg8bjhV2Ww4PJDS0Tj7L0_PsSU_pzbeuBf-scORD6xg9QLhyy36bYeQw2KBGELRxA/exec';
  const searchInput = document.getElementById('searchInput');
  const tableBody = document.querySelector('#feedbackTable tbody');
  
  let feedbackData = [];

  // Fungsi untuk menampilkan data pada tabel
  function renderTable(data) {
    tableBody.innerHTML = '';
    if(data.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="4" style="text-align:center;">Data tidak ditemukan</td>`;
      tableBody.appendChild(tr);
      return;
    }
    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.namaInitial}</td>
        <td>${row.tugasKe}</td>
        <td>${row.nilai}</td>
        <td>${row.feedback}</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Ambil data dari Apps Script
  fetch(url)
    .then(response => response.json())
    .then(data => {
      feedbackData = data;
      renderTable(feedbackData);
    })
    .catch(error => console.error('Error:', error));

  // Event listener untuk pencarian
  searchInput.addEventListener('input', function() {
    const keyword = this.value.toLowerCase().trim();
    let filteredData = feedbackData.filter(item => 
      item.namaInitial.toLowerCase().includes(keyword)
    );
    // Mengurutkan data sehingga nama yang cocok dari awal muncul lebih dahulu
    filteredData.sort((a, b) => {
      let indexA = a.namaInitial.toLowerCase().indexOf(keyword);
      let indexB = b.namaInitial.toLowerCase().indexOf(keyword);
      return indexA - indexB;
    });
    renderTable(filteredData);
  });

  // Tambahan interaktivitas: efek dinamis untuk header dan elemen lainnya
  const header = document.querySelector('header');
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    // Ubah background header secara dinamis berdasarkan posisi mouse
    header.style.background = `linear-gradient(135deg, rgba(${30 + x * 50}, ${30 + y * 50}, 30, 0.9), rgba(${50 + x * 50}, ${50 + y * 50}, 50, 0.9))`;
  });

  // Contoh tambahan: ubah warna baris tabel saat hover untuk kesan interaktif
  tableBody.addEventListener('mouseover', function(e) {
    const tr = e.target.closest('tr');
    if (tr) {
      tr.style.transition = 'background-color 0.3s ease';
      tr.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
    }
  });
  tableBody.addEventListener('mouseout', function(e) {
    const tr = e.target.closest('tr');
    if (tr) {
      tr.style.backgroundColor = '';
    }
  });
});
