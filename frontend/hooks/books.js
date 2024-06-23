document
    .getElementById('bookForm')
    .addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const author = document.getElementById('author').value;
        const release_date = document.getElementById('release_date').value;
        const is_available = document.getElementById('is_available').checked;

        axios
            .post('http://127.0.0.1:7000/books', {
                name: name,
                author: author,
                release_date: release_date,
                is_available: is_available,
            })
            .then((response) => {
                console.log(response.data);
                loadBooks();
            })
            .catch((error) => {
                console.error('There was an error adding the book!', error);
            });
    });

function loadBooks() {
    axios
        .get('http://127.0.0.1:7000/books')
        .then((response) => {
            const booksList = document.getElementById('booksList');
            booksList.innerHTML = '';

            response.data.forEach((book) => {
                const listItem = document.createElement('li');
                listItem.textContent = `Name: ${book.name}, Author: ${book.author}, Release Date: ${book.release_date}, Available: ${book.is_available}`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete Book';
                deleteButton.addEventListener('click', function () {
                    deleteBook(book.id);
                });

                listItem.appendChild(deleteButton);
                booksList.appendChild(listItem);
            });
        })
        .catch((error) => {
            console.error('There was an error loading books!', error);
        });
}

function deleteBook(id) {
    axios
        .delete(`http://127.0.0.1:7000/books/${id}`)
        .then((response) => {
            console.log(response.data);
            loadBooks();
        })
        .catch((error) => {
            console.error('There was an error deleting the book!', error);
        });
}

// Initial load of books
loadBooks();
