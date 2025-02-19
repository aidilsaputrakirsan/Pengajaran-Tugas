document.addEventListener('DOMContentLoaded', function() {
  const url = 'YOUR_APPS_SCRIPT_URL'; // Ganti dengan URL deploy Google Apps Script Anda
  const searchInput = document.getElementById('searchInput');
  const tableBody = document.querySelector('#feedbackTable tbody');
  
  let feedbackData = [];

  // Fungsi untuk menampilkan data ke tabel
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

    // Mengurutkan berdasarkan posisi kemunculan keyword
    filteredData.sort((a, b) => {
      let indexA = a.namaInitial.toLowerCase().indexOf(keyword);
      let indexB = b.namaInitial.toLowerCase().indexOf(keyword);
      return indexA - indexB;
    });
    
    renderTable(filteredData);
  });
});
