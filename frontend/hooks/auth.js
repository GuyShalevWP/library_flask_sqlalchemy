document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
});

const updateNavbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navRight = document.getElementById('nav-right');
    const manageCustomersLink = document.getElementById(
        'manage-customers-link'
    );

    if (user) {
        navRight.innerHTML = `Hello, ${user.first_name} | <a href="#" id="signout-link">Sign Out</a>`;
        document
            .getElementById('signout-link')
            .addEventListener('click', signOut);

        if (user.is_admin) {
            manageCustomersLink.innerHTML = ` | <a href="customers.html">Manage Customers</a>`;
        } else {
            manageCustomersLink.innerHTML = '';
        }
    } else {
        navRight.innerHTML = `<a href="signin.html">Sign In</a> | <a href="register.html">Register</a>`;
        manageCustomersLink.innerHTML = '';
    }
};

const signOut = () => {
    localStorage.removeItem('user');
    window.location.href = '../index.html';
};
