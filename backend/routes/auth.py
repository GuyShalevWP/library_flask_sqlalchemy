from flask import Blueprint, request, jsonify
from models.customer import Customer
from models import db
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route("/register", methods=['POST'])
def register():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    phone = data.get('phone')
    email = data.get('email')
    password = data.get('password')
    is_admin = data.get('is_admin', False)
    admin_code = data.get('admin_code')

    if not first_name or not last_name or not phone or not email or not password:
        return jsonify({"error": "Missing information"}), 400

    if is_admin and admin_code != 'admin123':
        return jsonify({"error": "Invalid admin code"}), 400

    hashed_password = generate_password_hash(password)  # Use default method (pbkdf2:sha256)
    customer = Customer(
        first_name=first_name,
        last_name=last_name,
        phone=phone,
        email=email,
        password=hashed_password,
        is_admin=is_admin,
        admin_code=admin_code
    )
    db.session.add(customer)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route("/signin", methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing information"}), 400

    customer = Customer.query.filter_by(email=email).first()
    if not customer or not check_password_hash(customer.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Sign in successful", "user": {"id": customer.id, "first_name": customer.first_name, "last_name": customer.last_name, "email": customer.email}}), 200
