from flask import Blueprint, jsonify, request
from app.services.auth_service import create_user, authenticate_user

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login_route():
    try:
        data = request.json
        if not data or 'email' not in data or 'senha' not in data:
            return jsonify({"message": "Email a senha. (Obrigatorios)"}), 400

        result = authenticate_user(data['email'], data['senha'])

        if result.get('success'):
            return jsonify(result), 200
        else:
            return jsonify(result), 400
        
    except Exception as e:
        return jsonify({"message": f"Erro interno: {str(e)}"}), 500
    

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        required_fields = {'name', 'email', 'senha', 'cargo'}

        if not data or not all(field in data for field in required_fields):
            return jsonify({
                "message": "Campos obrigatorios: Nome, E-mail, Senha e Cargo"
            }), 400
        
        result = create_user(data)

        if result.get('success'):
            return jsonify(result), 201
        else:
            return jsonify(result), 400
        

    except Exception as e:
        return jsonify({"message": f"Erro interno: {str(e)}"}), 500

