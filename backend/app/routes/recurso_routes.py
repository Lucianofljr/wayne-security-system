from flask import Blueprint, jsonify, request
from app.database import SessionLocal
from app.models import Recurso

resource_bp = Blueprint('recurso', __name__)

@resource_bp.route('/', methods=['GET'])
def get_resources():
    db = SessionLocal()
    try:
        resources = db.query(Recurso).all()
        result =[
            {
                "id": r.id,
                "nome": r.nome,
                "tipo": r.tipo,
                "quantidade": r.quantidade,
                "created_at": r.created_at,
                "updated_at": r.updated_at
            }
            for r in resources
        ]
        return jsonify(result), 200
    finally:
        db.close()


@resource_bp.route('/', methods=['POST'])
def create_resource():
    db = SessionLocal()
    try:
        data = request.json
        if not data or not all(k in data for k in ("nome", "tipo", "quantidade")):
            return jsonify({"message": "Arquivos requidos: Nome, Tipo, Quantidade"}), 400
        
        new_resource = Recurso(
            nome=data['nome'],
            tipo=data['tipo'],
            quantidade=data['quantidade']
        )
        db.add(new_resource)
        db.commit()
        db.refresh(new_resource)

        return jsonify({
            "id": new_resource.id,
            "nome": new_resource.nome,
            "tipo": new_resource.tipo,
            "quantidade": new_resource.quantidade
        }), 201
    
    except Exception as e:
        db.rollback()
        return jsonify({"message": f"Falha na criacao de recurso: {str(e)}"}), 500
    
    finally:
        db.close()

        
@resource_bp.route('/<int:resource_id>', methods=['GET'])
def get_resource(resource_id):
    db = SessionLocal()
    try:
        resource = db.query(Recurso).filter_by(id=resource_id).first()
        if not resource:
            return jsonify({"message": "Nao encontrado"}), 404
        
        return jsonify({
            "id": resource.id,
            "nome": resource.nome,
            "tipo": resource.tipo,
            "quantidade": resource.quantidade,
        }), 200

    finally:
        db.close()


@resource_bp.route('/<int:resource_id>', methods=['PUT'])
def update_resource(resource_id):
    db = SessionLocal()
    try:
        data = request.json
        resource = db.query(Recurso).filter_by(id=resource_id).first()
        if not resource:
            return jsonify({"message": "Nao encontrado"}), 404
        
        resource.nome = data.get("nome", resource.nome)
        resource.tipo = data.get("tipo", resource.tipo)
        resource.quantidade = data.get("quantidade", resource.quantidade)

        db.commit()
        db.refresh(resource)

        return jsonify({
            "id": resource.id,
            "nome": resource.nome,
            "tipo": resource.tipo,
            "quantidade": resource.quantidade
        }), 200
    
    except Exception as e:
        db.rollback()
        return jsonify({"message": f"Erro na atualizacao do recurso: {str(e)}"}), 500
    finally:
        db.close()


@resource_bp.route("/<int:resource_id>", methods=["DELETE"])
def delete_resource(resource_id):
    db = SessionLocal()
    try:
        resource = db.query(Recurso).filter_by(id=resource_id).first()
        if not resource:
            return jsonify({"message": "Resource not found"}), 404

        db.delete(resource)
        db.commit()
        return jsonify({"message": "Resource deleted successfully"}), 200
    except Exception as e:
        db.rollback()
        return jsonify({"message": f"Error deleting resource: {str(e)}"}), 500
    finally:
        db.close()

