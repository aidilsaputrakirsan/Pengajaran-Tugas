document.addEventListener('DOMContentLoaded', function() {
    // Highlight kata "harus"
    document.querySelectorAll('.slides section').forEach(function(slide) {
      let html = slide.innerHTML;
      html = html.replace(/\bharus\b/g, '<span style="background-color:yellow; font-weight:bold;">harus</span>');
      slide.innerHTML = html;
    });
  });
  