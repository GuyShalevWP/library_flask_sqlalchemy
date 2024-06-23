from flask import Blueprint, request, jsonify
from models.customer import Customer
from models import db
from werkzeug.security import generate_password_hash

customers_bp = Blueprint('customers_bp', __name__)

@customers_bp.route("/customers", methods=["GET"])
def get_customers():
    customers = Customer.query.all()
    customers_list = [{'id': customer.id, 'first_name': customer.first_name, 'last_name': customer.last_name, 'phone': customer.phone, 'email': customer.email, 'is_admin': customer.is_admin} for customer in customers]
    
    return jsonify(customers_list)

@customers_bp.route("/customer/<int:id>", methods=["GET"])
def get_customer(id):
    customer = Customer.query.get(id)
    if not customer:
        return jsonify({"error": "Customer ID not found"}), 404
    
    return jsonify({
        'id': customer.id,
        'first_name': customer.first_name,
        'last_name': customer.last_name,
        'phone': customer.phone,
        'email': customer.email,
        'is_admin': customer.is_admin
    })

@customers_bp.route("/customer/<int:id>", methods=["PUT"])
def update_customer(id):
    data = request.get_json()
    customer = Customer.query.get(id)
    if not customer:
        return jsonify({"error": "Customer ID not found"}), 404

    if 'first_name' in data:
        customer.first_name = data['first_name']
    if 'last_name' in data:
        customer.last_name = data['last_name']
    if 'phone' in data:
        customer.phone = data['phone']
    if 'email' in data:
        customer.email = data['email']
    if 'password' in data:
        customer.password = generate_password_hash(data['password'])  # Hash the new password
    if 'is_admin' in data:
        customer.is_admin = data['is_admin']

    db.session.commit()

    return jsonify({"message": "Customer updated successfully"}), 200

@customers_bp.route("/customer/<int:id>", methods=["DELETE"])
def delete_customer(id):
    customer = Customer.query.get(id)
    if not customer:
        return jsonify({"error": "Customer ID not found"}), 404

    db.session.delete(customer)
    db.session.commit()

    return jsonify({"message": "Customer deleted successfully"}), 200
