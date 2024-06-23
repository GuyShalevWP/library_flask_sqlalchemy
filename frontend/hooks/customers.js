document.addEventListener('DOMContentLoaded', function () {
    // Ensure only admin can access this page
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.is_admin) {
        alert('Access denied. Admins only.');
        window.location.href = '../index.html';
    }

    // Call updateNavbar from auth.js
    window.updateNavbar();
});
