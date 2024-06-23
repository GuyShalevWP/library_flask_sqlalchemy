export function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        document.getElementById(
            'welcome-message'
        ).innerText = `Hello, ${user.first_name}`;
        document.getElementById('signin-link').style.display = 'none';
        document.getElementById('register-link').style.display = 'none';
        document.getElementById('signout-link').style.display = 'inline';
    } else {
        document.getElementById('welcome-message').innerText = '';
        document.getElementById('signin-link').style.display = 'inline';
        document.getElementById('register-link').style.display = 'inline';
        document.getElementById('signout-link').style.display = 'none';
    }

    document
        .getElementById('signout-link')
        .addEventListener('click', function () {
            localStorage.removeItem('user');
            window.location.href = '../index.html';
        });
}

document.addEventListener('DOMContentLoaded', checkAuthState);
