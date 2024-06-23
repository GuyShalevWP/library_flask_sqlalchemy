document.addEventListener('DOMContentLoaded', function () {
    updateNavbar();
});

function updateNavbar() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navRight = document.getElementById('nav-right');
    const manageCustomersLink = document.getElementById(
        'manage-customers-link'
    );

    console.log('Updating navbar...'); // Debugging log
    console.log('User:', user); // Debugging log

    if (user) {
        navRight.innerHTML = `Hello, ${user.first_name} | <a href="#" id="signout-link">Sign Out</a>`;
        document
            .getElementById('signout-link')
            .addEventListener('click', function () {
                localStorage.removeItem('user');
                window.location.href = '../index.html';
            });

        console.log('User is admin:', user.is_admin); // Debugging log

        if (user.is_admin) {
            console.log('Admin verified'); // Debugging log
            if (manageCustomersLink) {
                manageCustomersLink.innerHTML = ` | <a href="pages/customers.html">Manage Customers</a>`;
            }
        }
    }
}

// Attach the function to the window object
window.updateNavbar = updateNavbar;
