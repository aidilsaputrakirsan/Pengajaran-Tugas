document.addEventListener('DOMContentLoaded', function() {
  const baseUrl = 'https://script.google.com/macros/s/AKfycbxZmYe2iYDe3OELfxApMLdCqvlIclyCdudkWY5yNJDPwsunSEnPHesdu6v8bZ2ueJ__/exec';
  
 // DOM Elements
 const searchInput = document.getElementById('searchInput');
 const tableBody = document.querySelector('#feedbackTable tbody');
 const tugasButtons = document.querySelectorAll('.tugas-btn');
 const tableContainer = document.querySelector('.table-container');
 const cardContainer = document.querySelector('.card-container');
 const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
 const glassElements = document.querySelectorAll('.glass-decoration');
 const header = document.querySelector('header');
 
 // State
 let feedbackData = [];
 let currentView = 'table';
 let loadingTimeout;
 
 // Initialize active task button
 const firstButton = document.querySelector('.tugas-btn');
 if (firstButton) {
   firstButton.classList.add('active');
 }
 
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
     
     // Rerender with current data
     renderData(feedbackData);
   });
 });
 
 // Enhanced loading functionality with timeout safeguard
 function showLoading() {
   if (!document.querySelector('.loading-overlay')) {
     const overlay = document.createElement('div');
     overlay.classList.add('loading-overlay');
     overlay.innerHTML = `
       <div class="spinner"></div>
     `;
     
     // Add to both containers
     tableContainer.appendChild(overlay.cloneNode(true));
     
     if (cardContainer) {
       cardContainer.appendChild(overlay);
     }
     
     // Set a timeout to automatically hide loading after 10 seconds
     loadingTimeout = setTimeout(() => {
       hideLoading();
       showError('Waktu request habis. Silakan coba lagi.');
     }, 10000);
   }
 }
 
 function hideLoading() {
   clearTimeout(loadingTimeout);
   const overlays = document.querySelectorAll('.loading-overlay');
   overlays.forEach(overlay => overlay.remove());
 }
 
 function showError(message) {
   const errorEl = document.createElement('div');
   errorEl.classList.add('error-message');
   errorEl.innerHTML = `
     <div class="error-icon"><i class="fas fa-exclamation-circle"></i></div>
     <p>${message}</p>
     <button class="error-close"><i class="fas fa-times"></i></button>
   `;
   document.body.appendChild(errorEl);
   
   // Auto dismiss after 5 seconds
   setTimeout(() => {
     errorEl.classList.add('fade-out');
     setTimeout(() => errorEl.remove(), 500);
   }, 5000);
   
   // Manual close
   errorEl.querySelector('.error-close').addEventListener('click', () => {
     errorEl.remove();
   });
 }
 
 // Enhanced fetch with retry logic
 function fetchData(sheetName, retryCount = 0) {
   showLoading();
   const url = `${baseUrl}?sheet=${sheetName}`;
   
   return fetch(url)
     .then(response => {
       if (!response.ok) {
         throw new Error(`Server returned ${response.status}`);
       }
       return response.json();
     })
     .then(data => {
       feedbackData = data;
       renderData(feedbackData);
     })
     .catch(error => {
       console.error('Error:', error);
       if (retryCount < 2) {
         console.log(`Retrying (${retryCount + 1}/2)...`);
         setTimeout(() => fetchData(sheetName, retryCount + 1), 1000);
       } else {
         showError('Gagal mengambil data. Silakan coba lagi nanti.');
       }
     })
     .finally(() => hideLoading());
 }
 
 // Format timestamp with improved date formatting
 function formatTimestamp(timestamp) {
   if (!timestamp) return "";
   
   const date = new Date(timestamp);
   
   // Check if date is valid
   if (isNaN(date.getTime())) return "Tanggal tidak valid";
   
   // Nama hari dalam bahasa Indonesia
   const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
   const dayName = days[date.getDay()];
   
   // Nama bulan dalam bahasa Indonesia
   const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
   const monthName = months[date.getMonth()];
   
   const day = date.getDate();
   const year = date.getFullYear();
   
   // Format waktu
   const hours = date.getHours().toString().padStart(2, '0');
   const minutes = date.getMinutes().toString().padStart(2, '0');
   
   // Format untuk tampilan card dan tabel
   if (currentView === 'card') {
     return `${day} ${monthName} ${year}, ${hours}:${minutes}`;
   } else {
     return `${dayName}, ${day} ${monthName} ${year} ${hours}:${minutes}`;
   }
 }
 
 // Format nilai with color coding
 function formatNilai(nilai) {
   let colorClass = '';
   
   if (nilai >= 85) {
     colorClass = 'nilai-a';
   } else if (nilai >= 75) {
     colorClass = 'nilai-b';
   } else if (nilai >= 65) {
     colorClass = 'nilai-c';
   } else if (nilai >= 50) {
     colorClass = 'nilai-d';
   } else {
     colorClass = 'nilai-e';
   }
   
   return `<span class="${colorClass}">${nilai}</span>`;
 }
 
 // Combined render function that supports both table and card views
 function renderData(data) {
   // Clear existing content
   tableBody.innerHTML = '';
   if (cardContainer) {
     cardContainer.innerHTML = '';
   }
   
   // Handle empty data
   if (data.length === 0) {
     // Table view
     const tr = document.createElement('tr');
     tr.innerHTML = `
       <td colspan="5" class="no-data">
         <div class="no-data-icon"><i class="fas fa-search"></i></div>
         <p>Data tidak ditemukan</p>
       </td>
     `;
     tableBody.appendChild(tr);
     
     // Card view
     if (cardContainer) {
       cardContainer.innerHTML = `
         <div class="no-data" style="grid-column: 1 / -1;">
           <div class="no-data-icon"><i class="fas fa-search"></i></div>
           <p>Data tidak ditemukan</p>
         </div>
       `;
     }
     return;
   }
   
   // Render data based on current view
   data.forEach((row, index) => {
     // Render for table view
     const tr = document.createElement('tr');
     tr.innerHTML = `
       <td>${row.namaInitial}</td>
       <td>${row.tugasKe}</td>
       <td>${formatNilai(row.nilai)}</td>
       <td>${row.feedback}</td>
       <td>${formatTimestamp(row.waktuSubmit)}</td>
     `;
     tr.style.animationDelay = `${index * 0.05}s`;
     tableBody.appendChild(tr);
     
     // Render for card view if it exists
     if (cardContainer && currentView === 'card') {
       const card = document.createElement('div');
       card.className = 'feedback-card';
       card.style.animationDelay = `${index * 0.05}s`;
       
       card.innerHTML = `
         <div class="card-header">
           <div class="card-title">${row.namaInitial}</div>
           <div class="card-badge">${row.tugasKe}</div>
         </div>
         <div class="card-content">
           <div class="card-feedback">${row.feedback}</div>
           <div class="card-meta">
             <div class="card-meta-item">
               <span class="card-meta-icon"><i class="fas fa-calendar-alt"></i></span>
               <span>${formatTimestamp(row.waktuSubmit)}</span>
             </div>
             <div class="card-meta-item">
               <span class="card-meta-icon"><i class="fas fa-star"></i></span>
               <span>${formatNilai(row.nilai)}</span>
             </div>
           </div>
         </div>
       `;
       
       // Add hover effect to show full feedback
       const feedbackEl = card.querySelector('.card-feedback');
       feedbackEl.addEventListener('mouseenter', () => {
         if (feedbackEl.scrollHeight > feedbackEl.clientHeight) {
           feedbackEl.style.maxHeight = `${feedbackEl.scrollHeight}px`;
         }
       });
       
       feedbackEl.addEventListener('mouseleave', () => {
         feedbackEl.style.maxHeight = '150px';
       });
       
       cardContainer.appendChild(card);
     }
   });
   
   // Add CSS for nilai colors
   if (!document.getElementById('nilai-styles')) {
     const style = document.createElement('style');
     style.id = 'nilai-styles';
     style.textContent = `
       .nilai-a { color: #4caf50; font-weight: bold; }
       .nilai-b { color: #2196f3; font-weight: bold; }
       .nilai-c { color: #ff9800; font-weight: bold; }
       .nilai-d { color: #f44336; font-weight: bold; }
       .nilai-e { color: #9c27b0; font-weight: bold; }
       
       tr { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
       
       .error-message {
         position: fixed;
         bottom: 20px;
         right: 20px;
         background: #f44336;
         color: white;
         padding: 15px;
         border-radius: 4px;
         display: flex;
         align-items: center;
         max-width: 400px;
         box-shadow: 0 4px 8px rgba(0,0,0,0.2);
         z-index: 1000;
         animation: slideInRight 0.3s ease-out;
       }
       
       .error-icon {
         margin-right: 10px;
         font-size: 24px;
       }
       
       .error-close {
         margin-left: 10px;
         background: none;
         border: none;
         color: white;
         cursor: pointer;
       }
       
       .fade-out {
         animation: fadeOut 0.5s forwards;
       }
       
       @keyframes slideInRight {
         from { transform: translateX(100%); opacity: 0; }
         to { transform: translateX(0); opacity: 1; }
       }
       
       @keyframes fadeOut {
         to { opacity: 0; }
       }
     `;
     document.head.appendChild(style);
   }
 }
 
 // First data load
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
     
     // Add ripple effect
     const ripple = document.createElement('span');
     ripple.classList.add('ripple');
     this.appendChild(ripple);
     setTimeout(() => ripple.remove(), 600);
   });
 });
 
 // Enhanced search with debounce
 let searchTimeout;
 if (searchInput) {
   searchInput.addEventListener('input', function() {
     clearTimeout(searchTimeout);
     searchTimeout = setTimeout(() => {
       const keyword = this.value.toLowerCase().trim();
       
       // Skip search if keyword is empty
       if (keyword === '') {
         renderData(feedbackData);
         return;
       }
       
       // Filter and sort by relevance
       let filteredData = feedbackData.filter(item =>
         item.namaInitial.toLowerCase().includes(keyword)
       );
       
       filteredData.sort((a, b) => {
         // Sort by keyword position first
         let indexA = a.namaInitial.toLowerCase().indexOf(keyword);
         let indexB = b.namaInitial.toLowerCase().indexOf(keyword);
         
         if (indexA !== indexB) return indexA - indexB;
         
         // If keyword position is the same, sort by name
         return a.namaInitial.localeCompare(b.namaInitial);
       });
       
       renderData(filteredData);
     }, 300); // 300ms debounce
   });
 }
 
 // Interactive background effects
 document.addEventListener('mousemove', e => {
   if (header) {
     // Calculate mouse position percentages
     const x = e.clientX / window.innerWidth;
     const y = e.clientY / window.innerHeight;
     
     // Update header gradient
     header.style.background = `linear-gradient(135deg, 
       rgba(${30 + x * 50}, ${30 + y * 50}, ${30 + (x + y) * 20}, 0.9), 
       rgba(${50 + y * 50}, ${50 + x * 50}, ${60 + (x + y) * 20}, 0.9))`;
     
     // Parallax effect for decorative elements
     glassElements.forEach(element => {
       const speedX = element.classList.contains('glass-decoration-1') ? -15 : 10;
       const speedY = element.classList.contains('glass-decoration-1') ? -10 : 15;
       element.style.transform = `translate(${x * speedX}px, ${y * speedY}px)`;
     });
   }
 });
 
 // Add CSS for ripple effect
 const rippleStyle = document.createElement('style');
 rippleStyle.textContent = `
   .ripple {
     position: absolute;
     background: rgba(255, 255, 255, 0.3);
     border-radius: 50%;
     width: 100px;
     height: 100px;
     margin-top: -50px;
     margin-left: -50px;
     transform: scale(0);
     animation: ripple 0.6s linear;
     pointer-events: none;
   }
   
   @keyframes ripple {
     to {
       transform: scale(2);
       opacity: 0;
     }
   }
 `;
 document.head.appendChild(rippleStyle);
 
 // Keyboard navigation
 document.addEventListener('keydown', function(e) {
   if (e.key === 'Escape') {
     // Clear search on Escape
     if (searchInput) {
       searchInput.value = '';
       renderData(feedbackData);
       searchInput.blur();
     }
   } else if (e.key === '/') {
     // Focus search on slash key press
     if (searchInput && document.activeElement !== searchInput) {
       e.preventDefault();
       searchInput.focus();
     }
   }
 });
 
 // Add tooltip for search shortcut
 if (searchInput) {
   searchInput.setAttribute('title', 'Tekan "/" untuk fokus pencarian');
 }
 
 // Add notification for keyboard shortcuts
 setTimeout(() => {
   const notification = document.createElement('div');
   notification.className = 'shortcut-tip';
   notification.innerHTML = `
     <div>
       <i class="fas fa-keyboard"></i> Shortcut Keyboard: 
       <kbd>/</kbd> untuk pencarian, <kbd>Esc</kbd> untuk clear
     </div>
     <button class="tip-close"><i class="fas fa-times"></i></button>
   `;
   document.body.appendChild(notification);
   
   notification.querySelector('.tip-close').addEventListener('click', () => {
     notification.remove();
   });
   
   setTimeout(() => {
     notification.classList.add('fade-out');
     setTimeout(() => notification.remove(), 500);
   }, 5000);
 }, 2000);
 
 // Add CSS for notification
 const notificationStyle = document.createElement('style');
 notificationStyle.textContent = `
   .shortcut-tip {
     position: fixed;
     bottom: 20px;
     left: 20px;
     background: rgba(0, 0, 0, 0.7);
     color: white;
     padding: 10px 15px;
     border-radius: 4px;
     font-size: 14px;
     display: flex;
     align-items: center;
     box-shadow: 0 2px 10px rgba(0,0,0,0.3);
     z-index: 1000;
     animation: slideInLeft 0.3s ease-out;
     backdrop-filter: blur(5px);
   }
   
   .shortcut-tip kbd {
     background: rgba(255,255,255,0.2);
     padding: 2px 6px;
     border-radius: 3px;
     margin: 0 3px;
   }
   
   .tip-close {
     background: none;
     border: none;
     color: white;
     margin-left: 10px;
     cursor: pointer;
     opacity: 0.7;
   }
   
   .tip-close:hover {
     opacity: 1;
   }
   
   @keyframes slideInLeft {
     from { transform: translateX(-100%); opacity: 0; }
     to { transform: translateX(0); opacity: 1; }
   }
 `;
 document.head.appendChild(notificationStyle);
});