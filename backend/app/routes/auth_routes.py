from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from app.services.auth_service import create_user, authenticate_user, get_user_by_id
from app.services.jwt_service import revoke_token, get_current_user_from_token  

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login_route():
    try:
        data = request.json
        if not data or 'email' not in data or 'senha' not in data:
            return jsonify({"message": "Email a senha. (Obrigatorios)"}), 400
        
        if not data['email'].strip() or not data['senha'].strip():
            return jsonify ({
                "message": "Email e senha devem estar preenchidos"
            }), 400

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
        required_fields = {'name', 'cpf', 'email', 'senha', 'cargo'}

        if not data or not all(field in data for field in required_fields):
            return jsonify({
                "message": "Campos obrigatorios: Nome, CPF, E-mail, Senha e Cargo"
            }), 400
        
        for field in required_fields:
            if not data[field].strip():
                return jsonify({
                    "message": f"Campo {field} deve estar preenchido."
                }), 400
        
        result = create_user(data)

        if result.get('success'):
            return jsonify(result), 201
        else:
            return jsonify(result), 400
        

    except Exception as e:
        return jsonify({"message": f"Erro interno: {str(e)}"}), 500


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():

    try:
        user_id = get_jwt_identity()

        user_data = get_user_by_id(user_id)

        if not user_data:
            return jsonify({
                "message": "Usuario não encontrado.",
            }), 400
        
        additional_claims = {
            "name": user_data['name'],
            "cpf": user_data['cpf'],
            "email": user_data['email'],
            "cargo": user_data['cargo']
        }

        new_token = create_access_token(
            identity = user_id,
            additional_claims = additional_claims
        )
        

        return jsonify({
            "token": new_token,
            "message": "Token renovado com sucesso!"
        }), 200
    
    except Exception as e:
        return jsonify({
            "message": f"Erro interno: {str(e)}"
        }), 500
    
@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        revoke_token()
        return jsonify({
            "message": "Você se desconectou.",
        }), 200
    
    except Exception as e:
        return jsonify({
            "message": f"Erro interno: {str(e)}"
        }), 500
    

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        current_user = get_current_user_from_token()
        
        if not current_user:
            return jsonify({
                'message': 'Usuário não encontrado',
                'error': 'user_not_found'
            }), 404
        
        # Buscar dados atualizados do usuário no banco
        user_data = get_user_by_id(current_user['id'])
        
        if not user_data:
            return jsonify({
                'message': 'Usuário não encontrado no banco de dados',
                'error': 'user_not_found'
            }), 404
        
        return jsonify({
            'success': True,
            'user': user_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'message': f'Erro ao obter usuário atual: {str(e)}',
            'error': 'internal_error'
        }), 500
    

@auth_bp.route('/validate', methods=['GET'])
@jwt_required()
def validate_token():
    try:
        user_data = get_current_user_from_token()

        return jsonify({
            "valid": True,
            "user": user_data
        }), 200
    
    except Exception as e:
        return jsonify({
            "valid": False,
            "message": f"Token inválido {str(e)}"
        }), 401


