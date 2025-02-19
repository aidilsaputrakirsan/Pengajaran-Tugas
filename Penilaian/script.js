document.addEventListener('DOMContentLoaded', () => {
  // Efek klik: animasi pada menu-item sebelum navigasi
  const menuItems = document.querySelectorAll('.menu-item');
  
  menuItems.forEach(item => {
    item.addEventListener('click', e => {
      // Jika ingin menambahkan delay animasi, cegah navigasi default dulu
      // e.preventDefault(); // Uncomment baris ini jika delay ingin dipaksa
      item.classList.add('clicked');
      // Delay 150ms untuk animasi sebelum redirect
      setTimeout(() => {
        // Jika e.preventDefault() digunakan, navigasi dapat dilakukan secara manual:
        // window.location.href = item.getAttribute('href');
      }, 150);
    });
  });
  
  // Interaktivitas tambahan: mengubah background header berdasarkan posisi mouse
  document.addEventListener('mousemove', e => {
    const header = document.querySelector('header');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    header.style.background = `linear-gradient(135deg, rgba(${30 + x*50}, ${30 + y*50}, 30, 0.8), rgba(${50 + x*50}, ${50 + y*50}, 50, 0.8))`;
  });
});
