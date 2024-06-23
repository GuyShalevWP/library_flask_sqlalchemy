import { checkAuthState } from './script.js';

document.addEventListener('DOMContentLoaded', function () {
    checkAuthState(); // Call the function to check authentication state

    document
        .getElementById('signinForm')
        .addEventListener('submit', function (event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            axios
                .post('http://127.0.0.1:7000/signin', {
                    email: email,
                    password: password,
                })
                .then((response) => {
                    console.log(response.data);
                    alert('Sign in successful');
                    localStorage.setItem(
                        'user',
                        JSON.stringify(response.data.user)
                    );
                    window.location.href = '../index.html';
                })
                .catch((error) => {
                    console.error('There was an error signing in!', error);
                    alert('Invalid credentials');
                });
        });
});
