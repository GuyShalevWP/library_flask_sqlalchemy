document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));

    // Allow anyone to see the books, but only admins to add, edit, and delete
    if (user && user.is_admin) {
        document.getElementById('addBookButton').style.display = 'inline';
    }

    updateNavbar();
    fetchBooks(user); // Pass user to fetchBooks

    document.getElementById('bookForm').addEventListener('submit', (event) => {
        event.preventDefault();
        saveBook();
    });

    document.getElementById('addBookButton').addEventListener('click', () => {
        openBookModal();
    });

    document.getElementById('searchButton').addEventListener('click', () => {
        searchBooks(user); // Pass user to searchBooks
    });

    document
        .getElementById('searchInput')
        .addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                searchBooks(user); // Pass user to searchBooks
            }
        });
});

const fetchBooks = (user) => {
    axios
        .get('http://127.0.0.1:7000/books')
        .then((response) => {
            const books = response.data;
            const bookTable = document.getElementById('bookTableBody');
            bookTable.innerHTML = '';

            books.forEach((book) => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${book.name}</td>
                    <td>${book.author}</td>
                    <td>${book.release_date}</td>
                    <td>${
                        book.is_available ? 'Available' : 'Not Available'
                    }</td>
                    <td>${
                        user && user.is_admin
                            ? `<button onclick="editBook(${book.id})">Edit</button>`
                            : ''
                    }</td>
                    <td>${
                        user && user.is_admin
                            ? `<button onclick="deleteBook(${book.id})">Delete</button>`
                            : ''
                    }</td>
                `;

                bookTable.appendChild(row);
            });
        })
        .catch((error) => {
            showNotification('Error fetching books.', 'error');
            console.error('Error fetching books:', error);
        });
};

const saveBook = () => {
    const id = document.getElementById('bookId').value;
    const name = document.getElementById('bookName').value;
    const author = document.getElementById('author').value;
    const releaseDate = document.getElementById('releaseDate').value;

    const bookData = {
        name: name,
        author: author,
        release_date: releaseDate,
        is_available: true,
    };

    const request = id
        ? axios.put(`http://127.0.0.1:7000/book/${id}`, bookData)
        : axios.post('http://127.0.0.1:7000/books', bookData);

    request
        .then((response) => {
            showNotification('Book saved successfully');
            closeBookModal();
            fetchBooks(JSON.parse(localStorage.getItem('user'))); // Ensure user is passed when fetching books
        })
        .catch((error) => {
            showNotification('Error saving book.', 'error');
            console.error('Error saving book:', error);
        });
};

const editBook = (id) => {
    axios
        .get(`http://127.0.0.1:7000/book/${id}`)
        .then((response) => {
            const book = response.data;
            document.getElementById('bookId').value = book.id;
            document.getElementById('bookName').value = book.name;
            document.getElementById('author').value = book.author;
            document.getElementById('releaseDate').value = book.release_date;
            openBookModal(true);
        })
        .catch((error) => {
            showNotification('Error fetching book details.', 'error');
            console.error('Error fetching book details:', error);
        });
};

const deleteBook = (id) => {
    axios
        .delete(`http://127.0.0.1:7000/book/${id}`)
        .then((response) => {
            showNotification('Book deleted successfully');
            fetchBooks(JSON.parse(localStorage.getItem('user'))); // Ensure user is passed when fetching books
        })
        .catch((error) => {
            showNotification('Error deleting book.', 'error');
            console.error('Error deleting book:', error);
        });
};

const searchBooks = (user) => {
    const searchInput = document
        .getElementById('searchInput')
        .value.toLowerCase();
    const searchType = document.getElementById('searchType').value;

    axios
        .get('http://127.0.0.1:7000/books')
        .then((response) => {
            const books = response.data;
            const filteredBooks = books.filter((book) => {
                if (searchType === 'name') {
                    return book.name.toLowerCase().includes(searchInput);
                } else if (searchType === 'author') {
                    return book.author.toLowerCase().includes(searchInput);
                } else if (searchType === 'release_date') {
                    return book.release_date.includes(searchInput);
                }
                return false;
            });

            const bookTable = document.getElementById('bookTableBody');
            bookTable.innerHTML = '';

            filteredBooks.forEach((book) => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${book.name}</td>
                    <td>${book.author}</td>
                    <td>${book.release_date}</td>
                    <td>${
                        book.is_available ? 'Available' : 'Not Available'
                    }</td>
                    <td>${
                        user && user.is_admin
                            ? `<button onclick="editBook(${book.id})">Edit</button>`
                            : ''
                    }</td>
                    <td>${
                        user && user.is_admin
                            ? `<button onclick="deleteBook(${book.id})">Delete</button>`
                            : ''
                    }</td>
                `;

                bookTable.appendChild(row);
            });
        })
        .catch((error) => {
            showNotification('Error fetching books.', 'error');
            console.error('Error fetching books:', error);
        });
};

const openBookModal = (isEdit = false) => {
    document.getElementById('bookModalTitle').innerText = isEdit
        ? 'Edit Book'
        : 'Add New Book';
    document.getElementById('bookModal').style.display = 'block';
};

const closeBookModal = () => {
    document.getElementById('bookModal').style.display = 'none';
    document.getElementById('bookForm').reset();
    document.getElementById('bookId').value = '';
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
