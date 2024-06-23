document
    .getElementById('customerForm')
    .addEventListener('submit', function (event) {
        event.preventDefault();

        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const is_admin = false; // Default value for is_admin

        axios
            .post('http://127.0.0.1:7000/customers', {
                first_name: first_name,
                last_name: last_name,
                phone: phone,
                email: email,
                password: password,
                is_admin: is_admin,
            })
            .then((response) => {
                console.log(response.data);
                loadCustomers();
            })
            .catch((error) => {
                console.error('There was an error adding the customer!', error);
            });
    });

function loadCustomers() {
    axios
        .get('http://127.0.0.1:7000/customers')
        .then((response) => {
            const customersList = document.getElementById('customersList');
            customersList.innerHTML = '';

            response.data.forEach((customer) => {
                const listItem = document.createElement('li');
                listItem.textContent = `First Name: ${customer.first_name}, Last Name: ${customer.last_name}, Phone: ${customer.phone}, Email: ${customer.email}`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete Customer';
                deleteButton.addEventListener('click', function () {
                    deleteCustomer(customer.id);
                });

                listItem.appendChild(deleteButton);
                customersList.appendChild(listItem);
            });
        })
        .catch((error) => {
            console.error('There was an error loading customers!', error);
        });
}

function deleteCustomer(id) {
    axios
        .delete(`http://127.0.0.1:7000/customers/${id}`)
        .then((response) => {
            console.log(response.data);
            loadCustomers();
        })
        .catch((error) => {
            console.error('There was an error deleting the customer!', error);
        });
}

// Initial load of customers
loadCustomers();
