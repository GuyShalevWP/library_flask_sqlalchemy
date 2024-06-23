document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        console.log('Form submission prevented');

        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log('Collected form data');

        axios
            .post('http://127.0.0.1:7000/register', {
                first_name: first_name,
                last_name: last_name,
                phone: phone,
                email: email,
                password: password,
                is_admin: false, // Default to false, change if necessary
            })
            .then((response) => {
                console.log('Registration successful', response.data);
                const user = response.data.user;
                localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage
                const messageDiv = document.getElementById('message');
                messageDiv.innerText =
                    'Registration successful! Redirecting to home page...';
                messageDiv.style.color = 'green';
                window.location.href = '../index.html'; // Redirect to home page
            })
            .catch((error) => {
                console.error('Registration failed', error);
                const messageDiv = document.getElementById('message');
                messageDiv.innerText = 'Registration failed. Please try again.';
                messageDiv.style.color = 'red';
            });
    });

    // Call updateNavbar from auth.js
    window.updateNavbar();
});
