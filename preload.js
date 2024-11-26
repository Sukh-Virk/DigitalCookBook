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


document.querySelectorAll('.use-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-href');
      if (target) {
        window.location.href = target; // Navigate to the target page
      } else {
        console.error('No target URL specified for this button.');
      }
    });
  });
  