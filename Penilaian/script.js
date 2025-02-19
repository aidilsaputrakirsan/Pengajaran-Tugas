document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item');
  
    // Tambahkan event listener untuk setiap menu-item
    menuItems.forEach(item => {
      item.addEventListener('click', function() {
        const targetUrl = this.getAttribute('data-url');
        // Efek klik ringan sebelum pindah halaman
        this.classList.add('clicked');
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 150);
      });
    });
  
    // Interaktivitas tambahan: mengubah background header berdasarkan posisi mouse
    document.addEventListener('mousemove', (e) => {
      const header = document.querySelector('header');
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      header.style.background = `linear-gradient(135deg, rgba(${30 + x*50}, ${30 + y*50}, 30, 0.8), rgba(${50 + x*50}, ${50 + y*50}, 50, 0.8))`;
    });
  });
  