document.addEventListener('DOMContentLoaded', function() {
  // Initialize Reveal.js with basic configuration
  Reveal.initialize({
      // Display settings
      width: '100%',
      height: '100%',
      margin: 0.04,
      minScale: 0.2,
      maxScale: 2.0,

      // Core settings
      hash: true,
      touch: true,
      center: false,
      progress: true,
      controls: true,

      // Transition
      transition: 'slide',
      transitionSpeed: 'default',

      // Plugins
      plugins: [RevealMath.MathJax3, RevealNotes, RevealZoom],

      // Math configuration
      math: {
          mathjax: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
          config: 'TeX-AMS_HTML-full',
          tex: {
              inlineMath: [['\\(', '\\)']],
              displayMath: [['\\[', '\\]']]
          }
      }
  });

  // Basic touch navigation
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
  });

  function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      const minSwipeDistance = 50;

      if (Math.abs(swipeDistance) > minSwipeDistance) {
          if (swipeDistance > 0) {
              Reveal.left(); // Swipe right to go back
          } else {
              Reveal.right(); // Swipe left to go forward
          }
      }
  }

  // Handle MathJax rendering
  Reveal.addEventListener('slidechanged', function() {
      if (typeof MathJax !== 'undefined') {
          MathJax.typesetPromise && MathJax.typesetPromise();
      }
  });
});