function showLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';
    
    setTimeout(() => {
        loader.style.display = 'none';
    }, 1000);
}

// Hover effect enhancement
document.querySelectorAll('.assignment-card').forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.backgroundColor = '#404040';
    });

    card.addEventListener('mouseout', () => {
        card.style.backgroundColor = '#363636';
    });
});