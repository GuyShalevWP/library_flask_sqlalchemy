from flask import Flask
from flask_cors import CORS
from helpers.database import init_db
from routes.books import books_bp
from routes.customers import customers_bp
from routes.borrowed_books import borrowed_books_bp
from models import db

app = Flask(__name__)

# Ensure the data directory exists and configure the database path
import os
data_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'data')
os.makedirs(data_dir, exist_ok=True)
database_path = os.path.join(data_dir, 'book.db')

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{database_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)  # Enable CORS for all routes

# Initialize the database
db.init_app(app)
init_db(app)

# Register Blueprints
app.register_blueprint(books_bp)
app.register_blueprint(customers_bp)
app.register_blueprint(borrowed_books_bp)

if __name__ == '__main__':
    app.run(debug=True, port=7000)
