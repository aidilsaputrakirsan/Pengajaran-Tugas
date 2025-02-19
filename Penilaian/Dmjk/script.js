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
  });
  