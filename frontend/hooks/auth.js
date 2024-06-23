document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
});

const updateNavbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navRight = document.getElementById('nav-right');
    const manageCustomersLink = document.getElementById(
        'manage-customers-link'
    );
    const manageBorrowBookLink = document.getElementById(
        'manage-borrow-book-link'
    );

    const currentPath = window.location.pathname;

    let signinPath = 'signin.html';
    let registerPath = 'register.html';
    let customersPath = 'customers.html';
    let borrowBookPath = 'borrow_book.html';

    if (currentPath.includes('index.html') || currentPath === '/') {
        signinPath = 'pages/signin.html';
        registerPath = 'pages/register.html';
        customersPath = 'pages/customers.html';
        borrowBookPath = 'pages/borrow_book.html';
    }

    if (user) {
        manageBorrowBookLink.innerHTML = ` | <a href="${borrowBookPath}">Borrow Books</a>`;
        navRight.innerHTML = `Hello, ${user.first_name} | <a href="#" id="signout-link">Sign Out</a>`;
        document
            .getElementById('signout-link')
            .addEventListener('click', signOut);

        if (user.is_admin) {
            manageCustomersLink.innerHTML = ` | <a href="${customersPath}">Manage Customers</a>`;
        } else {
            manageCustomersLink.innerHTML = '';
        }
    } else {
        navRight.innerHTML = `<a href="${signinPath}">Sign In</a> | <a href="${registerPath}">Register</a>`;
        manageCustomersLink.innerHTML = '';
        manageBorrowBookLink.innerHTML = '';
    }
};

const signOut = () => {
    localStorage.removeItem('user');
    window.location.href = '../index.html';
};
