document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.is_admin) {
        showNotification('Access denied. Admins only.', 'error');
        window.location.href = '../index.html';
        return;
    }

    updateNavbar();

    fetchCustomers();

    document
        .getElementById('editCustomerForm')
        .addEventListener('submit', (event) => {
            event.preventDefault();
            saveCustomerChanges();
        });

    document
        .getElementById('confirmDeleteButton')
        .addEventListener('click', () => {
            deleteCustomer();
        });

    document.getElementById('searchButton').addEventListener('click', () => {
        searchCustomers();
    });

    document
        .getElementById('searchInput')
        .addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                searchCustomers();
            }
        });
});

const fetchCustomers = () => {
    axios
        .get('http://127.0.0.1:7000/customers')
        .then((response) => {
            const customers = response.data;
            const customerTable = document.getElementById('customerTableBody');
            customerTable.innerHTML = '';

            customers.forEach((customer) => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${customer.first_name}</td>
                    <td>${customer.last_name}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.email}</td>
                    <td><button onclick="editCustomer(${customer.id})">Edit</button></td>
                    <td><button onclick="openDeleteModal(${customer.id})">Delete</button></td>
                `;

                customerTable.appendChild(row);
            });
        })
        .catch((error) => {
            showNotification('Error fetching customers.', 'error');
            console.error('Error fetching customers:', error);
        });
};

const editCustomer = (id) => {
    axios
        .get(`http://127.0.0.1:7000/customer/${id}`)
        .then((response) => {
            const customer = response.data;
            document.getElementById('editCustomerId').value = customer.id;
            document.getElementById('editFirstName').value =
                customer.first_name;
            document.getElementById('editLastName').value = customer.last_name;
            document.getElementById('editPhone').value = customer.phone;
            document.getElementById('editEmail').value = customer.email;
            openEditModal();
        })
        .catch((error) => {
            showNotification('Error fetching customer details.', 'error');
            console.error('Error fetching customer details:', error);
        });
};

const saveCustomerChanges = () => {
    const id = document.getElementById('editCustomerId').value;
    const firstName = document.getElementById('editFirstName').value;
    const lastName = document.getElementById('editLastName').value;
    const phone = document.getElementById('editPhone').value;
    const email = document.getElementById('editEmail').value;

    axios
        .put(`http://127.0.0.1:7000/customer/${id}`, {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            email: email,
        })
        .then((response) => {
            showNotification('Customer details updated successfully');
            closeEditModal();
            fetchCustomers();
        })
        .catch((error) => {
            showNotification('Error updating customer details.', 'error');
            console.error('Error updating customer details:', error);
        });
};

const searchCustomers = () => {
    const searchInput = document
        .getElementById('searchInput')
        .value.toLowerCase();
    const searchType = document.getElementById('searchType').value;

    axios
        .get('http://127.0.0.1:7000/customers')
        .then((response) => {
            const customers = response.data;
            const filteredCustomers = customers.filter((customer) => {
                if (searchType === 'first_name') {
                    return customer.first_name
                        .toLowerCase()
                        .includes(searchInput);
                } else if (searchType === 'last_name') {
                    return customer.last_name
                        .toLowerCase()
                        .includes(searchInput);
                }
                return false;
            });

            const customerTable = document.getElementById('customerTableBody');
            customerTable.innerHTML = '';

            filteredCustomers.forEach((customer) => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${customer.first_name}</td>
                    <td>${customer.last_name}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.email}</td>
                    <td><button onclick="editCustomer(${customer.id})">Edit</button></td>
                    <td><button onclick="openDeleteModal(${customer.id})">Delete</button></td>
                `;

                customerTable.appendChild(row);
            });
        })
        .catch((error) => {
            showNotification('Error fetching customers.', 'error');
            console.error('Error fetching customers:', error);
        });
};

let deleteCustomerId = null;

const openDeleteModal = (id) => {
    deleteCustomerId = id;
    document.getElementById('deleteModal').style.display = 'block';
};

const closeDeleteModal = () => {
    deleteCustomerId = null;
    document.getElementById('deleteModal').style.display = 'none';
};

const deleteCustomer = () => {
    if (deleteCustomerId) {
        axios
            .delete(`http://127.0.0.1:7000/customer/${deleteCustomerId}`)
            .then((response) => {
                showNotification('Customer deleted successfully');
                closeDeleteModal();
                fetchCustomers();
            })
            .catch((error) => {
                showNotification('Error deleting customer.', 'error');
                console.error('Error deleting customer:', error);
            });
    }
};

const openEditModal = () => {
    document.getElementById('editModal').style.display = 'block';
};

const closeEditModal = () => {
    document.getElementById('editModal').style.display = 'none';
};

const showNotification = (message, type) => {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.className = 'notification';

    if (type === 'error') {
        notification.classList.add('error');
    }

    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
};
