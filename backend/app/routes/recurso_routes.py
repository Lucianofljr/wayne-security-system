from flask import Blueprint, jsonify

recurso_bp = Blueprint('recurso', __name__)

@recurso_bp.route('/', methods=['GET'])
def get_recurso():
    return jsonify({'message': 'Recursos funcionando!'})