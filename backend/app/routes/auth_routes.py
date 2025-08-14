from flask import Blueprint, jsonify, request
from app.services.auth_service import create_user, login

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = login(data['email'], data['senha'])
    if user:
        return jsonify({"message": "Login bem-sucedido"})
    return jsonify({"message": "Credenciais invalidas"}), 401


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    result = create_user(data)
    return jsonify(result)

