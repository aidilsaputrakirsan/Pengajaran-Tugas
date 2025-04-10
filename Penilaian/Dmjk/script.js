document.addEventListener('DOMContentLoaded', function() {
  const baseUrl = 'https://script.google.com/macros/s/AKfycbzaC88rTzhkatp4rUocrVorc3zOigX-LHtesMp8GD9mrgxvaWWaJ9X4Cm7hgcQnyIcW/exec';
  
 // DOM Elements
 const searchInput = document.getElementById('searchInput');
 const tableBody = document.querySelector('#feedbackTable tbody');
 const tugasButtons = document.querySelectorAll('.tugas-btn');
 const tableContainer = document.querySelector('.table-container');
 const cardContainer = document.querySelector('.card-container');
 const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
 const header = document.querySelector('header');
 const body = document.querySelector('body');
 
 // State
 let feedbackData = [];
 let currentView = 'table';
 let loadingTimeout;
 let activeTask = 'tugas1';
 
 // Inisialisasi
 initializeUI();
 
 // Fungsi untuk menginisialisasi UI
 function initializeUI() {
   // Tambahkan dekorasi visual
   createParticles();
   addGlassDecorations();
   
   // Aktifkan tombol tugas pertama
   if (tugasButtons.length > 0) {
     tugasButtons[0].classList.add('active');
   }
   
   // Setup event listeners
   setupEventListeners();
   
   // Ambil data default
   fetchData(activeTask);
 }
 
 // Membuat partikel latar belakang
 function createParticles() {
   const particleContainer = document.createElement('div');
   particleContainer.className = 'particles';
   body.appendChild(particleContainer);
   
   // Buat 20 partikel
   for (let i = 0; i < 20; i++) {
     createParticle(particleContainer);
   }
 }
 
 // Membuat satu partikel dengan properti acak
 function createParticle(container) {
   const particle = document.createElement('div');
   particle.className = 'particle';
   
   // Properti acak
   const size = Math.random() * 5 + 2;
   const posX = Math.random() * window.innerWidth;
   const posY = Math.random() * window.innerHeight;
   const duration = Math.random() * 20 + 10;
   const delay = Math.random() * 5;
   
   // Setel properti CSS
   particle.style.width = `${size}px`;
   particle.style.height = `${size}px`;
   particle.style.left = `${posX}px`;
   particle.style.top = `${posY}px`;
   particle.style.animationDuration = `${duration}s`;
   particle.style.animationDelay = `${delay}s`;
   
   // Pilih warna acak
   const colors = ['rgba(34, 197, 94, 0.2)', 'rgba(14, 165, 233, 0.2)', 'rgba(79, 70, 229, 0.2)'];
   particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
   
   // Tambahkan ke container
   container.appendChild(particle);
   
   // Hapus dan buat ulang setelah durasi animasi
   setTimeout(() => {
     particle.remove();
     createParticle(container);
   }, (duration + delay) * 1000);
 }
 
 // Tambahkan elemen dekorasi glassmorphism
 function addGlassDecorations() {
   if (!document.querySelector('.glass-decoration-3')) {
     const decoration = document.createElement('div');
     decoration.className = 'glass-decoration glass-decoration-3';
     body.appendChild(decoration);
   }
 }
 
 // Setup event listeners
 function setupEventListeners() {
   // View toggle
   viewToggleBtns.forEach(btn => {
     btn.addEventListener('click', function() {
       const view = this.getAttribute('data-view');
       
       // Update active state
       viewToggleBtns.forEach(b => b.classList.remove('active'));
       this.classList.add('active');
       
       // Tampilkan view yang dipilih
       if (view === 'card') {
         tableContainer.style.display = 'none';
         cardContainer.style.display = 'grid';
         currentView = 'card';
       } else {
         tableContainer.style.display = 'block';
         cardContainer.style.display = 'none';
         currentView = 'table';
       }
       
       // Re-render data
       renderData(feedbackData);
       
       // Tambahkan efek klik
       addClickEffect(this);
     });
   });
   
   // Tugas buttons
   tugasButtons.forEach(btn => {
     btn.addEventListener('click', function() {
       // Update active state
       tugasButtons.forEach(b => b.classList.remove('active'));
       this.classList.add('active');
       
       // Simpan status tugas aktif
       activeTask = this.getAttribute('data-sheet');
       
       // Ambil data
       fetchData(activeTask);
       
       // Reset pencarian
       if (searchInput) searchInput.value = '';
       
       // Tambahkan efek klik
       addClickEffect(this);
     });
   });
   
   // Search functionality
   if (searchInput) {
     let debounceTimeout;
     
     searchInput.addEventListener('input', function() {
       clearTimeout(debounceTimeout);
       
       debounceTimeout = setTimeout(() => {
         const keyword = this.value.toLowerCase().trim();
         
         // Filter data berdasarkan kata kunci
         let filteredData = feedbackData.filter(item =>
           item.namaInitial.toLowerCase().includes(keyword)
         );
         
         // Urutkan berdasarkan kesesuaian
         filteredData.sort((a, b) => {
           const indexA = a.namaInitial.toLowerCase().indexOf(keyword);
           const indexB = b.namaInitial.toLowerCase().indexOf(keyword);
           return indexA - indexB;
         });
         
         renderData(filteredData);
       }, 300);
     });
     
     // Keyboard shortcuts
     document.addEventListener('keydown', e => {
       if (e.key === '/' && document.activeElement !== searchInput) {
         e.preventDefault();
         searchInput.focus();
       } else if (e.key === 'Escape') {
         searchInput.value = '';
         renderData(feedbackData);
         searchInput.blur();
       }
     });
     
     // Tampilkan tip untuk keyboard shortcuts
     setTimeout(() => {
       showKeyboardShortcutTip();
     }, 1500);
   }
   
   // Interactive background
   document.addEventListener('mousemove', e => {
     const x = e.clientX / window.innerWidth;
     const y = e.clientY / window.innerHeight;
     
     if (header) {
       header.style.background = `linear-gradient(135deg, 
         rgba(${22 + x * 30}, ${155 + y * 30}, ${94 + (x + y) * 15}, 0.9), 
         rgba(${10 + y * 30}, ${17 + x * 50}, ${55 + (x + y) * 15}, 0.9))`;
     }
     
     // Efek parallax pada dekorasi
     const glassElements = document.querySelectorAll('.glass-decoration');
     glassElements.forEach(element => {
       const speedX = element.classList.contains('glass-decoration-1') ? -20 : (element.classList.contains('glass-decoration-2') ? 15 : 10);
       const speedY = element.classList.contains('glass-decoration-1') ? -15 : (element.classList.contains('glass-decoration-2') ? 20 : -10);
       element.style.transform = `translate(${x * speedX}px, ${y * speedY}px)`;
     });
   });
 }
 
 // Tambahkan efek klik ripple
 function addClickEffect(element) {
   const ripple = document.createElement('span');
   ripple.className = 'ripple';
   
   const rect = element.getBoundingClientRect();
   const size = Math.max(rect.width, rect.height) * 2;
   
   ripple.style.width = ripple.style.height = `${size}px`;
   ripple.style.left = `${size / 2}px`;
   ripple.style.top = `${size / 2}px`;
   
   element.appendChild(ripple);
   
   setTimeout(() => {
     ripple.remove();
   }, 600);
 }
 
 // Tampilkan tips keyboard shortcuts
 function showKeyboardShortcutTip() {
   if (document.querySelector('.shortcut-tip')) return;
   
   const tip = document.createElement('div');
   tip.className = 'shortcut-tip';
   tip.innerHTML = `
     <div>
       <i class="fas fa-keyboard"></i> Shortcuts: 
       <kbd>/</kbd> untuk pencarian, <kbd>Esc</kbd> untuk reset
     </div>
     <button class="tip-close"><i class="fas fa-times"></i></button>
   `;
   document.body.appendChild(tip);
   
   tip.querySelector('.tip-close').addEventListener('click', () => {
     tip.classList.add('fade-out');
     setTimeout(() => tip.remove(), 300);
   });
   
   setTimeout(() => {
     tip.classList.add('fade-out');
     setTimeout(() => tip.remove(), 300);
   }, 5000);
 }
 
 // Tampilkan loading spinner
 function showLoading() {
   if (!document.querySelector('.loading-overlay')) {
     const overlay = document.createElement('div');
     overlay.className = 'loading-overlay';
     overlay.innerHTML = `<div class="spinner"></div>`;
     
     // Tambahkan ke container yang aktif
     if (currentView === 'card') {
       cardContainer.appendChild(overlay);
     } else {
       tableContainer.appendChild(overlay);
     }
     
     // Timeout keamanan
     loadingTimeout = setTimeout(() => {
       hideLoading();
       showError('Waktu permintaan habis. Silakan coba lagi.');
     }, 10000);
   }
 }
 
 // Sembunyikan loading spinner
 function hideLoading() {
   clearTimeout(loadingTimeout);
   const overlays = document.querySelectorAll('.loading-overlay');
   overlays.forEach(overlay => {
     overlay.classList.add('fade-out');
     setTimeout(() => overlay.remove(), 300);
   });
 }
 
 // Tampilkan pesan error
 function showError(message) {
   const errorEl = document.createElement('div');
   errorEl.className = 'error-message';
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
     errorEl.classList.add('fade-out');
     setTimeout(() => errorEl.remove(), 300);
   });
 }
 
 // Ambil data dari API
 function fetchData(sheetName, retryCount = 0) {
   showLoading();
   const url = `${baseUrl}?sheet=${sheetName}`;
   
   fetch(url)
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
         renderData([]);
       }
     })
     .finally(() => hideLoading());
 }
 
 // Format timestamp dengan format yang lebih baik
 function formatTimestamp(timestamp) {
   if (!timestamp) return "";
   
   const date = new Date(timestamp);
   
   // Check if date is valid
   if (isNaN(date.getTime())) return "Tanggal tidak valid";
   
   // Nama hari dan bulan dalam bahasa Indonesia
   const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
   const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
   
   const dayName = days[date.getDay()];
   const day = date.getDate();
   const month = months[date.getMonth()];
   const year = date.getFullYear();
   
   // Format waktu
   const hours = date.getHours().toString().padStart(2, '0');
   const minutes = date.getMinutes().toString().padStart(2, '0');
   
   // Format berbeda untuk tampilan card dan tabel
   if (currentView === 'card') {
     return `${day} ${month} ${year}, ${hours}:${minutes}`;
   } else {
     return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}`;
   }
 }
 
 // Format nilai with color coding - DIMODIFIKASI UNTUK HANYA MENAMPILKAN NILAI ANGKA
 function formatNilai(nilai) {
   let colorClass = '';
   
   if (nilai >= 90) {
     colorClass = 'nilai-a';
   } else if (nilai >= 80) {
     colorClass = 'nilai-b';
   } else if (nilai >= 70) {
     colorClass = 'nilai-c';
   } else if (nilai >= 60) {
     colorClass = 'nilai-d';
   } else {
     colorClass = 'nilai-e';
   }
   
   // Hanya menampilkan nilai angka tanpa konversi ke huruf
   return `<span class="${colorClass}">${nilai}</span>`;
 }
 
 // Render data based on current view
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
   
   // Add staggered animation delay
   const animationDelay = 50; // ms between each item
   
   // Render data based on current view
   data.forEach((row, index) => {
     // Table view
     const tr = document.createElement('tr');
     tr.style.animationDelay = `${index * animationDelay}ms`;
     tr.innerHTML = `
       <td>${row.namaInitial}</td>
       <td>${row.tugasKe}</td>
       <td>${formatNilai(row.nilai)}</td>
       <td>${row.feedback}</td>
       <td>${formatTimestamp(row.waktuSubmit)}</td>
     `;
     tableBody.appendChild(tr);
     
     // Card view
     if (cardContainer && currentView === 'card') {
       const card = document.createElement('div');
       card.className = 'feedback-card';
       card.style.animationDelay = `${index * animationDelay}ms`;
       
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
               <span>${formatNilai(row.nilai)}</span>
             </div>
           </div>
         </div>
       `;
       
       cardContainer.appendChild(card);
     }
   });
 }
 
 // Add CSS style untuk animasi
 if (!document.getElementById('animation-styles')) {
   const style = document.createElement('style');
   style.id = 'animation-styles';
   style.textContent = `
     tr {
       animation: fadeInUp 0.5s ease-out forwards;
       opacity: 0;
     }
     
     .feedback-card {
       animation: fadeInUp 0.5s ease-out forwards;
       opacity: 0;
     }
     
     @keyframes fadeInUp {
       from {
         opacity: 0;
         transform: translateY(20px);
       }
       to {
         opacity: 1;
         transform: translateY(0);
       }
     }
     
     .fade-out {
       animation: fadeOut 0.3s forwards;
     }
     
     @keyframes fadeOut {
       to { opacity: 0; }
     }
     
     .error-message {
       position: fixed;
       bottom: 20px;
       right: 20px;
       background: var(--gradient-dark);
       color: var(--text-primary);
       padding: 15px;
       border-radius: var(--radius-lg);
       display: flex;
       align-items: center;
       max-width: 400px;
       box-shadow: var(--shadow-md);
       z-index: 1000;
       animation: slideInRight 0.3s ease-out;
       border: 1px solid var(--card-border);
     }
     
     .error-icon {
       margin-right: 10px;
       font-size: 24px;
       color: #ef4444;
     }
     
     .error-close {
       margin-left: 10px;
       background: none;
       border: none;
       color: var(--text-secondary);
       cursor: pointer;
     }
     
     @keyframes slideInRight {
       from { transform: translateX(100%); opacity: 0; }
       to { transform: translateX(0); opacity: 1; }
     }
     
     .tip-close {
       background: none;
       border: none;
       color: var(--text-secondary);
       margin-left: 10px;
       cursor: pointer;
       opacity: 0.7;
     }
     
     .tip-close:hover {
       opacity: 1;
     }
   `;
   document.head.appendChild(style);
 }
});