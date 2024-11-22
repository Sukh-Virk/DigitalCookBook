document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById('preloader');
    // Simulate loading delay (2 seconds)
    setTimeout(() => {
        preloader.style.opacity = '0'; // Fade-out effect
        setTimeout(() => {
            preloader.style.display = 'none'; // Remove from view
        }, 500); // Matches fade-out transition
    }, 2000); // Time for animation (adjust as needed)
});