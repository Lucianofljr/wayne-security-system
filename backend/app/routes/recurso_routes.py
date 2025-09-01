from flask import Blueprint, jsonify, request
from app.database import SessionLocal
from app.models import Recurso
from flask_jwt_extended import jwt_required

resource_bp = Blueprint('recurso', __name__)

@resource_bp.route('/', methods=['GET'])
@jwt_required()
def get_resources():
    db = SessionLocal()
    try:
        resources = db.query(Recurso).all()
        result = [
            {
                "id": r.id,
                "nome": r.nome,
                "tipo": r.tipo,
                "quantidade": r.quantidade,
                "valor_unit": r.valor_unit,
                "created_at": r.created_at.isoformat() if r.created_at else None,
                "updated_at": r.updated_at.isoformat() if r.updated_at else None
            }
            for r in resources
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"message": f"Erro ao carregar recursos: {str(e)}"}), 500
    finally:
        db.close()

@resource_bp.route('/', methods=['POST'])
@jwt_required()
def create_resource():
    db = SessionLocal()
    try:
        data = request.json
        if not data or not all(k in data for k in ("nome", "tipo", "quantidade")):
            return jsonify({"message": "Campos obrigatórios: nome, tipo, quantidade"}), 400
        
        new_resource = Recurso(
            nome=data['nome'],
            tipo=data['tipo'],
            quantidade=int(data['quantidade']),
            valor_unit=float(data.get('valor_unit', 0))
        )
        db.add(new_resource)
        db.commit()
        db.refresh(new_resource)

        return jsonify({
            "id": new_resource.id,
            "nome": new_resource.nome,
            "tipo": new_resource.tipo,
            "quantidade": new_resource.quantidade,
            "valor_unit": new_resource.valor_unit,
            "created_at": new_resource.created_at.isoformat() if new_resource.created_at else None
        }), 201
    
    except Exception as e:
        db.rollback()
        return jsonify({"message": f"Falha na criação de recurso: {str(e)}"}), 500
    finally:
        db.close()

@resource_bp.route('/<int:resource_id>', methods=['GET'])
@jwt_required()
def get_resource(resource_id):
    db = SessionLocal()
    try:
        resource = db.query(Recurso).filter_by(id=resource_id).first()
        if not resource:
            return jsonify({"message": "Recurso não encontrado"}), 404
        
        return jsonify({
            "id": resource.id,
            "nome": resource.nome,
            "tipo": resource.tipo,
            "quantidade": resource.quantidade,
            "valor_unit": resource.valor_unit
        }), 200
    finally:
        db.close()

@resource_bp.route('/<int:resource_id>', methods=['PUT'])
@jwt_required()
def update_resource(resource_id):
    db = SessionLocal()
    try:
        data = request.json
        resource = db.query(Recurso).filter_by(id=resource_id).first()
        if not resource:
            return jsonify({"message": "Recurso não encontrado"}), 404
        
        resource.nome = data.get("nome", resource.nome)
        resource.tipo = data.get("tipo", resource.tipo)
        resource.quantidade = data.get("quantidade", resource.quantidade)
        resource.valor_unit = data.get("valor_unit", resource.valor_unit)

        db.commit()
        db.refresh(resource)

        return jsonify({
            "id": resource.id,
            "nome": resource.nome,
            "tipo": resource.tipo,
            "quantidade": resource.quantidade,
            "valor_unit": resource.valor_unit
        }), 200
    
    except Exception as e:
        db.rollback()
        return jsonify({"message": f"Erro na atualização do recurso: {str(e)}"}), 500
    finally:
        db.close()

@resource_bp.route("/<int:resource_id>", methods=["DELETE"])
@jwt_required()
def delete_resource(resource_id):
    db = SessionLocal()
    try:
        resource = db.query(Recurso).filter_by(id=resource_id).first()
        if not resource:
            return jsonify({"message": "Recurso não encontrado"}), 404

        db.delete(resource)
        db.commit()
        return jsonify({"message": "Recurso deletado com sucesso"}), 200
    except Exception as e:
        db.rollback()
        return jsonify({"message": f"Erro ao deletar recurso: {str(e)}"}), 500
    finally:
        db.close()

