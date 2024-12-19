document.addEventListener('DOMContentLoaded', function() {
  // Highlight kata "harus"
  document.querySelectorAll('.slides section').forEach(function(slide) {
    let html = slide.innerHTML;
    html = html.replace(/\bharus\b/g, '<span style="background-color:yellow; font-weight:bold;">harus</span>');
    slide.innerHTML = html;
  });

  // Initialize Reveal.js with proper configuration
  Reveal.initialize({
    hash: true,
    transition: 'slide',
    touch: true, // Enable touch navigation
    controls: true, // Show navigation controls
    progress: true, // Show progress bar
    center: true,
    width: '100%',
    height: '100%',
    margin: 0,
    minScale: 0.2,
    maxScale: 2.0,
    plugins: [
      RevealMath.MathJax3,
      RevealZoom,
      RevealNotes,
      RevealSearch
    ],
    math: {
      mathjax: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
      config: 'TeX-AMS_HTML-full',
      tex: {
        inlineMath: [['\\(', '\\)']],
        displayMath: [['\\[', '\\]']],
        packages: ['base', 'ams', 'noerrors', 'noundefined']
      }
    },
    keyboard: {
      // Enable keyboard navigation
      33: 'prev', // PgUp
      34: 'next', // PgDown
      37: 'prev', // Left arrow
      39: 'next'  // Right arrow
    },
    // Enable slide navigation via swipe
    touch: true,
    // Disables the default reveal.js slide layout so your custom styles work better
    disableLayout: false,
  });

  // Add touch event listeners for mobile navigation
  let touchstartX = 0;
  let touchendX = 0;

  document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
  });

  document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchendX < touchstartX) Reveal.right();
    if (touchendX > touchstartX) Reveal.left();
  }

  // Adjust slide size on window resize
  window.addEventListener('resize', function() {
    Reveal.layout();
  });
});