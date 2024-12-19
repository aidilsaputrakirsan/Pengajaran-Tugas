document.addEventListener('DOMContentLoaded', function() {
    // Highlight kata "harus"
    document.querySelectorAll('.slides section').forEach(function(slide) {
      let html = slide.innerHTML;
      html = html.replace(/\bharus\b/g, '<span style="background-color:yellow; font-weight:bold;">harus</span>');
      slide.innerHTML = html;
    });
  });
  

  Reveal.initialize({
      hash: true,
      transition: 'fade',
      plugins: [ RevealMath.MathJax3({
        mathjax: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
        tex: {
          inlineMath: [['\\(','\\)']],
          displayMath: [['\\[','\\]']]
        }
      }) ],
      // Jangan atur minScale, maxScale secara paksa
      // Jangan atur overflow pada .slides dengan !important
      center: true
    });
  
  <script src="https://unpkg.com/reveal.js/plugin/math/math.js"></script>
