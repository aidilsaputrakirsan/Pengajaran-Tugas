function showLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';
    
    setTimeout(() => {
        loader.style.display = 'none';
    }, 1000);
}

// Enhanced hover interactions
document.querySelectorAll('.course').forEach(course => {
    course.addEventListener('mouseenter', () => {
        course.style.transform = 'translateY(-10px) scale(1.02)';
        course.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
        course.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    course.addEventListener('mouseleave', () => {
        course.style.transform = 'translateY(0) scale(1)';
        course.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
    });

    course.addEventListener('click', function(e) {
        if (!course.querySelector('a[href="#"]')) {
            const rect = course.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            
            course.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        }
    });
});