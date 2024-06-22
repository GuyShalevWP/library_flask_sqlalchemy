from flask import Blueprint, request, jsonify
from models.customer import Customer
from models import db

customers_bp = Blueprint('customers_bp', __name__)

@customers_bp.route("/newcustomer", methods=['POST'])
def create_customer():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    phone = data.get('phone')
    email = data.get('email')
    password = data.get('password')
    is_admin = data.get('is_admin', False)
    admin_code = data.get('admin_code') if is_admin else None

    if not first_name or not last_name or not phone or not email or not password:
        return jsonify({"error": "Missing information"}), 400

    customer = Customer(
        first_name=first_name,
        last_name=last_name,
        phone=phone,
        email=email,
        password=password,
        is_admin=is_admin,
        admin_code=admin_code
    )
    db.session.add(customer)
    db.session.commit()

    return jsonify({
        'first_name': customer.first_name,
        'last_name': customer.last_name,
        'phone': customer.phone,
        'email': customer.email,
        'is_admin': customer.is_admin,
        'admin_code': customer.admin_code
    }), 201

@customers_bp.route("/customers", methods=["GET"])
def get_customers():
    customers = Customer.query.all()
    customers_list = [{'id': customer.id, 'first_name': customer.first_name, 'last_name': customer.last_name, 'phone': customer.phone, 'email': customer.email, 'is_admin': customer.is_admin, 'admin_code': customer.admin_code} for customer in customers]
    
    return jsonify(customers_list)

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
        customer.password = data['password']
    if 'is_admin' in data:
        customer.is_admin = data['is_admin']
        if customer.is_admin and 'admin_code' in data:
            customer.admin_code = data['admin_code']
        elif not customer.is_admin:
            customer.admin_code = None

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
