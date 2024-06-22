from . import db

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    author = db.Column(db.String(80), nullable=False)
    release_date = db.Column(db.String(20), nullable=False)
    is_available = db.Column(db.Boolean, nullable=False)
