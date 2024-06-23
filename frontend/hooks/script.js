document.addEventListener('DOMContentLoaded', function () {
    // Update navbar based on sign-in status
    const user = JSON.parse(localStorage.getItem('user'));
    const manageCustomersLink = document.getElementById(
        'manage-customers-link'
    );

    if (user) {
        const navRight = document.getElementById('nav-right');
        navRight.innerHTML = `Hello, ${user.first_name} | <a href="#" id="signout-link">Sign Out</a>`;
        document
            .getElementById('signout-link')
            .addEventListener('click', function () {
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            });

        if (user.is_admin) {
            manageCustomersLink.innerHTML = ` | <a href="pages/customers.html">Manage Customers</a>`;
        }
    }
});
