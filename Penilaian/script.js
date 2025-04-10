document.addEventListener('DOMContentLoaded', () => {
  // Interactive elements
  const menuItems = document.querySelectorAll('.menu-item');
  const body = document.querySelector('body');
  
  // Parallax effect for decorative elements
  const glassElements = document.querySelectorAll('.glass-decoration');
  
  // Interactive background effect on mouse move
  document.addEventListener('mousemove', e => {
    const header = document.querySelector('header');
    
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
  
  // Add entrance animations with staggered delay
  menuItems.forEach((item, index) => {
    setTimeout(() => {
      item.style.opacity = '0';
      item.style.animation = `slideUp 0.5s ease-out ${index * 0.1}s forwards`;
    }, 100);
  });
  
  // Click effect with ripple animation
  menuItems.forEach(item => {
    item.addEventListener('click', e => {
      // Create ripple element
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      // Position ripple at click point
      const rect = item.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      
      // Add ripple to element
      item.appendChild(ripple);
      
      // Add clicked class for scaling effect
      item.classList.add('clicked');
      
      // Clean up after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Easter egg - Konami code detection
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  
  document.addEventListener('keydown', e => {
    // Check if the key matches the next key in the Konami code
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      
      // If the full code is entered, trigger easter egg
      if (konamiIndex === konamiCode.length) {
        activateEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0; // Reset if wrong key is pressed
    }
  });
  
  // Easter egg animation
  function activateEasterEgg() {
    // Create confetti elements
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.animationDelay = `${Math.random() * 3}s`;
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
      document.body.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }
    
    // Add congratulatory message
    const message = document.createElement('div');
    message.classList.add('easter-egg-message');
    message.textContent = 'Konami Code Activated!';
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 3000);
  }
  
  // Add CSS for Konami code elements
  const style = document.createElement('style');
  style.textContent = `
    .ripple {
      position: absolute;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .confetti {
      position: fixed;
      width: 10px;
      height: 10px;
      top: -10px;
      border-radius: 0;
      animation: confetti 3s ease-in forwards;
      z-index: 1000;
    }
    
    @keyframes confetti {
      0% {
        transform: translateY(0) rotate(0);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
    
    .easter-egg-message {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--accent-primary);
      color: white;
      padding: 20px 30px;
      border-radius: 10px;
      font-size: 24px;
      font-weight: bold;
      z-index: 1001;
      animation: pulse 1s infinite alternate;
    }
  `;
  document.head.appendChild(style);
});