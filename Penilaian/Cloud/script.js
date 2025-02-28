document.addEventListener('DOMContentLoaded', function() {
  const baseUrl = 'https://script.google.com/macros/s/AKfycby9MypC1jwc-XWPXjKb_cPt465DSfiagH_Zt_1ZIWOgYVhmkC4dW_hpvNDRoBYzDLmv/exec';
  
  const searchInput = document.getElementById('searchInput');
  const tableBody = document.querySelector('#feedbackTable tbody');
  const tugasButtons = document.querySelectorAll('.tugas-btn');
  const tableContainer = document.querySelector('.table-container');
  let feedbackData = [];
  
  // Fungsi untuk menampilkan loading overlay
  function showLoading() {
    if (!document.querySelector('.loading-overlay')) {
      const overlay = document.createElement('div');
      overlay.classList.add('loading-overlay');
      overlay.innerHTML = `<div class="spinner"></div>`;
      tableContainer.appendChild(overlay);
    }
  }
  
  // Fungsi untuk menghilangkan loading overlay
  function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) overlay.remove();
  }
  
  // Fungsi untuk mengambil data dari sheet
  function fetchData(sheetName) {
    showLoading();
    const url = `${baseUrl}?sheet=${sheetName}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        feedbackData = data;
        renderTable(feedbackData);
      })
      .catch(error => console.error('Error:', error))
      .finally(() => hideLoading());
  }
  
  // Fungsi untuk memformat timestamp menjadi "Hari, M/d/yyyy hh:mm:ss"
  function formatTimestamp(timestamp) {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    // Nama hari dalam bahasa Indonesia (index 0 = Minggu)
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
    const dayName = days[date.getDay()];
    const month = date.getMonth() + 1; // getMonth() mulai dari 0
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours(); // Format 24 jam, tidak dipadkan nol jika <10
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${dayName}, ${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  }
  
  // Fungsi untuk merender tabel
  function renderTable(data) {
    tableBody.innerHTML = '';
    if (data.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="5" style="text-align:center;">Data tidak ditemukan</td>`;
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
        <td>${formatTimestamp(row.waktuSubmit)}</td>
      `;
      tableBody.appendChild(tr);
    });
  }
  
  // Ambil data default (misalnya, tugas1)
  fetchData('tugas1');
  
  // Event listener pada tombol tugas
  tugasButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      tugasButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const sheetName = this.getAttribute('data-sheet');
      fetchData(sheetName);
      if (searchInput) searchInput.value = '';
    });
  });
  
  // Event listener untuk pencarian
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const keyword = this.value.toLowerCase().trim();
      let filteredData = feedbackData.filter(item =>
        item.namaInitial.toLowerCase().includes(keyword)
      );
      filteredData.sort((a, b) => {
        let indexA = a.namaInitial.toLowerCase().indexOf(keyword);
        let indexB = b.namaInitial.toLowerCase().indexOf(keyword);
        return indexA - indexB;
      });
      renderTable(filteredData);
    });
  }
  
  // Efek interaktif tambahan: mengubah background header berdasarkan posisi mouse
  const header = document.querySelector('header');
  if (header) {
    document.addEventListener('mousemove', e => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      header.style.background = `linear-gradient(135deg, rgba(${30 + x * 50}, ${30 + y * 50}, 30, 0.9), rgba(${50 + x * 50}, ${50 + y * 50}, 50, 0.9))`;
    });
  }
  
  // Efek interaktif pada baris tabel: perubahan warna saat hover
  if (tableBody) {
    tableBody.addEventListener('mouseover', e => {
      const tr = e.target.closest('tr');
      if (tr) {
        tr.style.transition = 'background-color 0.3s ease';
        tr.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
      }
    });
    tableBody.addEventListener('mouseout', e => {
      const tr = e.target.closest('tr');
      if (tr) {
        tr.style.backgroundColor = '';
      }
    });
  }
});
