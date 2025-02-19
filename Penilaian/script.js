document.addEventListener('DOMContentLoaded', function() {
    // Ganti URL di bawah dengan URL deploy Google Apps Script Anda
    const url = 'https://script.google.com/macros/s/AKfycbwEootT8YjFav8a15R_4FZ0cRm-vjjUqjfe5RigYVElG05eSEIerkwjqLQDjp7N1oKkMg/exec'; 
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const tableBody = document.querySelector('#feedbackTable tbody');
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
      })
      .catch(error => console.error('Error:', error));
  });
  