document.addEventListener('DOMContentLoaded', function() {
  // Remove loading spinner
  window.addEventListener('load', function() {
    document.querySelector('.loading-spinner').style.display = 'none';
  });

  // Initialize Reveal.js
  let deck = new Reveal({
    // Display
    width: '100%',
    height: '100%',
    margin: 0,
    minScale: 0.2,
    maxScale: 1.5,

    // Features
    hash: true,
    touch: true,
    controls: true,
    progress: true,
    center: true,
    mouseWheel: false,

    // Transition
    transition: 'fade',
    transitionSpeed: 'fast',

    // Plugins
    plugins: [
      RevealMarkdown,
      RevealHighlight,
      RevealMath.MathJax3,
      RevealNotes,
      RevealSearch,
      RevealZoom,
      RevealMenu
    ],

    // Menu Plugin Config
    menu: {
      side: 'left',
      numbers: true,
      markers: true,
      themes: [
        { name: 'Black', theme: 'css/theme/black.css' },
        { name: 'White', theme: 'css/theme/white.css' }
      ]
    },

    // Math Config
    math: {
      mathjax: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
      config: 'TeX-AMS_HTML-full',
      tex: {
        inlineMath: [['\\(', '\\)']],
        displayMath: [['\\[', '\\]']],
        packages: ['base', 'ams', 'noerrors', 'noundefined'],
        tags: 'ams'
      }
    }
  });

  deck.initialize();

  // Custom Progress Bar
  function updateProgress() {
    const progress = deck.getProgress();
    document.querySelector('.custom-progress').style.width = (progress * 100) + '%';
  }
  deck.on('slidechanged', updateProgress);

  // Navigation Hint
  const navigationHint = document.querySelector('.navigation-hint');
  let hintTimeout;

  function showNavigationHint() {
    navigationHint.style.opacity = '1';
    clearTimeout(hintTimeout);
    hintTimeout = setTimeout(() => {
      navigationHint.style.opacity = '0';
    }, 2000);
  }

  deck.on('slidechanged', showNavigationHint);

  // Highlight Implementation
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightBlock(block);
  });

  // Enhanced Touch Navigation
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  });

  document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  });

  function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    const ratioX = Math.abs(diffX / diffY);
    const ratioY = Math.abs(diffY / diffX);
    const absDiff = Math.abs(diffX);
    const minSwipeDistance = 50; // Minimum swipe distance in pixels

    // Only handle horizontal swipes if they're intentional (ratio > 2 means more horizontal than vertical)
    if (absDiff > minSwipeDistance && ratioX > 2) {
      if (diffX > 0) {
        deck.left(); // Swipe right to go back
      } else {
        deck.right(); // Swipe left to go forward
      }
    }
  }

  // Keyboard Navigation Enhancement
  document.addEventListener('keydown', function(event) {
    // Space and arrow keys
    if(event.keyCode === 32 || event.keyCode === 39) {
      deck.right();
      event.preventDefault();
    }
    if(event.keyCode === 37) {
      deck.left();
      event.preventDefault();
    }
  });

  // Handle window resize
  window.addEventListener('resize', function() {
    // Add a small delay to ensure proper layout calculation
    setTimeout(() => {
      deck.layout();
    }, 200);
  });

  // Add dynamic slide numbers
  function updateSlideNumbers() {
    const indices = deck.getIndices();
    const totalSlides = deck.getTotalSlides();
    const currentSlide = indices.h + 1;
    
    document.querySelectorAll('.slide-number').forEach(el => {
      el.textContent = `${currentSlide}/${totalSlides}`;
    });
  }

  deck.on('slidechanged', updateSlideNumbers);

  // Handle math rendering
  deck.on('slidechanged', event => {
    if (typeof MathJax !== 'undefined') {
      MathJax.typesetPromise();
    }
  });

  // Add zoom functionality for images
  document.querySelectorAll('.soal img').forEach(img => {
    img.addEventListener('click', function() {
      if (this.classList.contains('zoomed')) {
        this.classList.remove('zoomed');
      } else {
        this.classList.add('zoomed');
      }
    });
  });

  // Initialize first load
  updateProgress();
  updateSlideNumbers();
  showNavigationHint();
});