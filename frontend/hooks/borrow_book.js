import { checkAuthState } from './script.js';

document.addEventListener('DOMContentLoaded', function () {
    checkAuthState(); // Call the function to check authentication state

    document
        .getElementById('borrowForm')
        .addEventListener('submit', function (event) {
            event.preventDefault();

            const customer_id = document.getElementById('customer_id').value;
            const book_id = document.getElementById('book_id').value;
            const borrow_date = document.getElementById('borrow_date').value;
            const return_type = document.getElementById('return_type').value;

            axios
                .post('http://127.0.0.1:7000/borrow', {
                    customer_id: customer_id,
                    book_id: book_id,
                    borrow_date: borrow_date,
                    return_type: return_type,
                })
                .then((response) => {
                    console.log(response.data);
                    loadBorrowedBooks();
                })
                .catch((error) => {
                    console.error(
                        'There was an error borrowing the book!',
                        error
                    );
                });
        });

    function loadBorrowedBooks() {
        axios
            .get('http://127.0.0.1:7000/borrowed_books')
            .then((response) => {
                const borrowedBooksList =
                    document.getElementById('borrowedBooksList');
                borrowedBooksList.innerHTML = '';

                response.data.forEach((book) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `Customer ID: ${book.customer_id}, Book ID: ${book.book_id}, Borrow Date: ${book.borrow_date}, Return Type: ${book.return_type}`;

                    const returnButton = document.createElement('button');
                    returnButton.textContent = 'Return Book';
                    returnButton.addEventListener('click', function () {
                        returnBook(book.id);
                    });

                    listItem.appendChild(returnButton);
                    borrowedBooksList.appendChild(listItem);
                });
            })
            .catch((error) => {
                console.error(
                    'There was an error loading borrowed books!',
                    error
                );
            });
    }

    function returnBook(id) {
        axios
            .delete(`http://127.0.0.1:7000/borrow/${id}`)
            .then((response) => {
                console.log(response.data);
                loadBorrowedBooks();
            })
            .catch((error) => {
                console.error('There was an error returning the book!', error);
            });
    }

    // Initial load of borrowed books
    loadBorrowedBooks();
});
