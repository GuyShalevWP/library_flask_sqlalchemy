document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    populateCustomers();
    populateBooks();

    document
        .getElementById('borrowBookForm')
        .addEventListener('submit', (event) => {
            event.preventDefault();
            borrowBook();
        });
});

const populateCustomers = () => {
    axios
        .get('http://127.0.0.1:7000/customers')
        .then((response) => {
            const customers = response.data;
            const customerSelect = document.getElementById('customer');
            customers.forEach((customer) => {
                const option = document.createElement('option');
                option.value = customer.id;
                option.textContent = `${customer.first_name} ${customer.last_name}`;
                customerSelect.appendChild(option);
            });
        })
        .catch((error) => {
            showNotification('Error fetching customers.', 'error');
            console.error('Error fetching customers:', error);
        });
};

const populateBooks = () => {
    axios
        .get('http://127.0.0.1:7000/books')
        .then((response) => {
            const books = response.data;
            const bookSelect = document.getElementById('book');
            books.forEach((book) => {
                if (book.is_available) {
                    const option = document.createElement('option');
                    option.value = book.id;
                    option.textContent = `${book.name} by ${book.author}`;
                    bookSelect.appendChild(option);
                }
            });
        })
        .catch((error) => {
            showNotification('Error fetching books.', 'error');
            console.error('Error fetching books:', error);
        });
};

const borrowBook = () => {
    const customerId = document.getElementById('customer').value;
    const bookId = document.getElementById('book').value;
    const borrowType = document.getElementById('borrowType').value;

    axios
        .post('http://127.0.0.1:7000/borrow', {
            customer_id: customerId,
            book_id: bookId,
            borrow_type: borrowType,
        })
        .then((response) => {
            showNotification('Book borrowed successfully', 'success');
            document.getElementById('borrowBookForm').reset();
        })
        .catch((error) => {
            showNotification('Error borrowing book.', 'error');
            console.error('Error borrowing book:', error);
        });
};

const showNotification = (message, type) => {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.className = 'notification';

    if (type === 'error') {
        notification.classList.add('error');
    } else if (type === 'success') {
        notification.classList.add('success');
    }

    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
};
