from flask import Blueprint, request, jsonify
from models.book import Book
from models import db

books_bp = Blueprint('books_bp', __name__)

@books_bp.route("/newbook", methods=['POST'])
def create_book():
    data = request.get_json()
    name = data.get('name')
    author = data.get('author')
    release_date = data.get('release_date')
    is_available = data.get('is_available')

    if not name or not author or not release_date or is_available is None:
        return jsonify({"error": "Missing information"}), 400

    book = Book(name=name, author=author, release_date=release_date, is_available=is_available)
    db.session.add(book)
    db.session.commit()

    return jsonify({
        'name': book.name,
        'author': book.author,
        'release_date': book.release_date,
        'is_available': book.is_available
    }), 201

@books_bp.route("/books", methods=["GET"])
def get_books():
    books = Book.query.all()
    books_list = [{'id': book.id, 'name': book.name, 'author': book.author, 'release_date': book.release_date, 'is_available': book.is_available} for book in books]
    
    return jsonify(books_list)

@books_bp.route("/book/<int:id>", methods=["PUT"])
def update_book(id):
    data = request.get_json()
    name = data.get('name')
    author = data.get('author')
    release_date = data.get('release_date')
    is_available = data.get('is_available')

    if not name or not author or not release_date or is_available is None:
        return jsonify({"error": "Missing information"}), 400

    book = Book.query.get(id)
    if not book:
        return jsonify({"error": "Book ID not found"}), 404

    book.name = name
    book.author = author
    book.release_date = release_date
    book.is_available = is_available
    db.session.commit()

    return jsonify({"message": "Book updated successfully"}), 200

@books_bp.route("/book/<int:id>", methods=["DELETE"])
def delete_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"error": "Book ID not found"}), 404

    db.session.delete(book)
    db.session.commit()

    return jsonify({"message": "Book deleted successfully"}), 200
