from flask import Blueprint, request, jsonify
from models.borrowed_book import BorrowedBook
from models import db

borrowed_books_bp = Blueprint('borrowed_books_bp', __name__)

@borrowed_books_bp.route("/borrow", methods=['POST'])
def borrow_book():
    data = request.get_json()
    customer_id = data.get('customer_id')
    book_id = data.get('book_id')
    borrow_date = data.get('borrow_date')
    return_type = data.get('return_type')

    if not customer_id or not book_id or not borrow_date or not return_type:
        return jsonify({"error": "Missing information"}), 400

    borrowed_book = BorrowedBook(
        customer_id=customer_id,
        book_id=book_id,
        borrow_date=borrow_date,
        return_type=return_type
    )
    db.session.add(borrowed_book)
    db.session.commit()

    return jsonify({
        'customer_id': borrowed_book.customer_id,
        'book_id': borrowed_book.book_id,
        'borrow_date': borrowed_book.borrow_date,
        'return_type': borrowed_book.return_type
    }), 201

@borrowed_books_bp.route("/borrowed_books", methods=["GET"])
def get_borrowed_books():
    borrowed_books = BorrowedBook.query.all()
    borrowed_books_list = [{
        'id': borrowed_book.id,
        'customer_id': borrowed_book.customer_id,
        'book_id': borrowed_book.book_id,
        'borrow_date': borrowed_book.borrow_date,
        'return_type': borrowed_book.return_type
    } for borrowed_book in borrowed_books]
    
    return jsonify(borrowed_books_list)
