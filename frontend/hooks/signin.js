document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signinForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        console.log('Form submission prevented');

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log('Collected form data');

        axios
            .post('http://127.0.0.1:7000/signin', {
                email: email,
                password: password,
            })
            .then((response) => {
                console.log('Sign-in successful', response.data);
                const user = response.data.user;
                localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage
                const messageDiv = document.getElementById('message');
                messageDiv.innerText =
                    'Sign-in successful! Redirecting to home page...';
                messageDiv.style.color = 'green';
                window.location.href = '../index.html'; // Redirect to home page
            })
            .catch((error) => {
                console.error('Sign-in failed', error);
                const messageDiv = document.getElementById('message');
                messageDiv.innerText = 'Sign-in failed. Please try again.';
                messageDiv.style.color = 'red';
            });
    });

    // Call updateNavbar from auth.js
    window.updateNavbar();
});
