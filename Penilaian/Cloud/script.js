document.addEventListener('DOMContentLoaded', function() {
  // Untuk halaman Cloud - sesuaikan URL sesuai kebutuhan
  const baseUrl = 'https://script.google.com/macros/s/AKfycby9MypC1jwc-XWPXjKb_cPt465DSfiagH_Zt_1ZIWOgYVhmkC4dW_hpvNDRoBYzDLmv/exec';
  
  // DOM Elements
  const searchInput = document.getElementById('searchInput');
  const tableBody = document.querySelector('#feedbackTable tbody');
  const tugasButtons = document.querySelectorAll('.tugas-btn');
  const tableContainer = document.querySelector('.table-container');
  const cardContainer = document.querySelector('.card-container');
  const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
  const header = document.querySelector('header');
  
  // State
  let feedbackData = [];
  let currentView = 'table';
  
  // View toggle functionality
  viewToggleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const view = this.getAttribute('data-view');
      
      // Update active state
      viewToggleBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Show/hide appropriate view
      if (view === 'card') {
        tableContainer.style.display = 'none';
        cardContainer.style.display = 'grid';
        currentView = 'card';
      } else {
        tableContainer.style.display = 'block';
        cardContainer.style.display = 'none';
        currentView = 'table';
      }
      
      // Re-render with current data
      renderData(feedbackData);
    });
  });
  
  // Loading functionality
  function showLoading() {
    if (!document.querySelector('.loading-overlay')) {
      const overlay = document.createElement('div');
      overlay.classList.add('loading-overlay');
      overlay.innerHTML = `<div class="spinner"></div>`;
      
      // Add to active container
      if (currentView === 'card') {
        cardContainer.appendChild(overlay);
      } else {
        tableContainer.appendChild(overlay);
      }
    }
  }
  
  function hideLoading() {
    const overlays = document.querySelectorAll('.loading-overlay');
    overlays.forEach(overlay => overlay.remove());
  }
  
  // Fetch data
  function fetchData(sheetName) {
    showLoading();
    const url = `${baseUrl}?sheet=${sheetName}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        feedbackData = data;
        renderData(feedbackData);
      })
      .catch(error => {
        console.error('Error:', error);
        tableBody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align:center;">
              Error loading data. Please try again.
            </td>
          </tr>
        `;
      })
      .finally(() => hideLoading());
  }
  
  // Format timestamp dengan format yang lebih baik
  function formatTimestamp(timestamp) {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return "Tanggal tidak valid";
    
    // Nama hari dalam bahasa Indonesia
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
    const dayName = days[date.getDay()];
    
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    // Format waktu
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    // Format untuk tampilan card dan tabel
    if (currentView === 'card') {
      return `${day}/${month}/${year}, ${hours}:${minutes}`;
    } else {
      return `${dayName}, ${day}/${month}/${year} ${hours}:${minutes}`;
    }
  }
  
  // Render data berdasarkan view
  function renderData(data) {
    // Clear existing content
    tableBody.innerHTML = '';
    if (cardContainer) {
      cardContainer.innerHTML = '';
    }
    
    // Handle empty data
    if (!data || data.length === 0) {
      // Table view
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td colspan="5" style="text-align:center;">Data tidak ditemukan</td>
      `;
      tableBody.appendChild(tr);
      
      // Card view
      if (cardContainer) {
        cardContainer.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
            <p>Data tidak ditemukan</p>
          </div>
        `;
      }
      return;
    }
    
    // Render data based on current view
    data.forEach(row => {
      // Render for table view
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.namaInitial}</td>
        <td>${row.tugasKe}</td>
        <td>${row.nilai}</td>
        <td>${row.feedback}</td>
        <td>${formatTimestamp(row.waktuSubmit)}</td>
      `;
      tableBody.appendChild(tr);
      
      // Render for card view if it exists
      if (cardContainer && currentView === 'card') {
        const card = document.createElement('div');
        card.className = 'feedback-card';
        
        card.innerHTML = `
          <div class="card-header">
            <div class="card-title">${row.namaInitial}</div>
            <div class="card-badge">${row.tugasKe}</div>
          </div>
          <div class="card-content">
            <div class="card-feedback">${row.feedback}</div>
            <div class="card-meta">
              <div class="card-meta-item">
                <i class="fas fa-calendar-alt"></i>
                <span>${formatTimestamp(row.waktuSubmit)}</span>
              </div>
              <div class="card-meta-item">
                <i class="fas fa-star"></i>
                <span>${row.nilai}</span>
              </div>
            </div>
          </div>
        `;
        
        cardContainer.appendChild(card);
      }
    });
  }
  
  // Load default data
  fetchData('tugas1');
  
  // Event listener for task buttons
  tugasButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active state
      tugasButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Fetch data for selected task
      const sheetName = this.getAttribute('data-sheet');
      fetchData(sheetName);
      
      // Clear search
      if (searchInput) searchInput.value = '';
    });
  });
  
  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const keyword = this.value.toLowerCase().trim();
      
      // Filter data
      let filteredData = feedbackData.filter(item =>
        item.namaInitial.toLowerCase().includes(keyword)
      );
      
      // Sort by relevance
      filteredData.sort((a, b) => {
        let indexA = a.namaInitial.toLowerCase().indexOf(keyword);
        let indexB = b.namaInitial.toLowerCase().indexOf(keyword);
        return indexA - indexB;
      });
      
      renderData(filteredData);
    });
  }
  
  // Interactive effect for header
  if (header) {
    document.addEventListener('mousemove', e => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      header.style.background = `linear-gradient(135deg, 
        rgba(${30 + x * 50}, ${30 + y * 50}, 30, 0.9), 
        rgba(${50 + y * 50}, ${50 + x * 50}, 50, 0.9))`;
    });
  }
});