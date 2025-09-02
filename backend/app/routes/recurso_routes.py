from flask import Blueprint, jsonify, request
from app.database import SessionLocal
from app.models import Recurso
from flask_jwt_extended import jwt_required, get_jwt
from sqlalchemy.exc import IntegrityError

resource_bp = Blueprint('recurso', __name__)

def get_current_user_role():
    """Extrai o cargo do usuário atual do JWT"""
    try:
        claims = get_jwt()
        return claims.get('cargo', 'usuario')
    except:
        return 'usuario'

@resource_bp.route('/', methods=['GET'])
@jwt_required()
def get_resources():
    """Buscar todos os recursos"""
    db = SessionLocal()
    try:
        resources = db.query(Recurso).all()
        result = []
        
        for r in resources:
            result.append({
                "id": r.id,
                "nome": r.nome,
                "tipo": r.tipo,
                "quantidade": r.quantidade,
                "valor_unit": r.valor_unit,
                "created_at": r.created_at.isoformat() if r.created_at else None,
                "updated_at": r.updated_at.isoformat() if r.updated_at else None
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"message": f"Erro ao carregar recursos: {str(e)}"}), 500
    finally:
        db.close()

@resource_bp.route('/', methods=['POST'])
@jwt_required()
def create_resource():
    """Criar novo recurso (admin/gerente apenas)"""
    user_role = get_current_user_role()
    
    if user_role not in ['admin', 'gerente']:
        return jsonify({"message": "Permissão negada. Apenas admin e gerente podem criar recursos."}), 403
    
    db = SessionLocal()
    try:
        data = request.json
        
        # Validações
        if not data:
            return jsonify({"message": "Dados não fornecidos"}), 400
            
        required_fields = ["nome", "tipo", "quantidade", "valor_unit"]
        missing_fields = [field for field in required_fields if field not in data or data[field] is None]
        
        if missing_fields:
            return jsonify({"message": f"Campos obrigatórios: {', '.join(missing_fields)}"}), 400
        
        # Validações de negócio
        if not data['nome'].strip():
            return jsonify({"message": "Nome do recurso não pode estar vazio"}), 400
            
        if not data['tipo'].strip():
            return jsonify({"message": "Tipo do recurso não pode estar vazio"}), 400
            
        if int(data['quantidade']) < 0:
            return jsonify({"message": "Quantidade não pode ser negativa"}), 400
            
        if float(data['valor_unit']) <= 0:
            return jsonify({"message": "Valor unitário deve ser maior que zero"}), 400
        
        # Verificar se já existe recurso com mesmo nome
        existing = db.query(Recurso).filter_by(nome=data['nome'].strip()).first()
        if existing:
            return jsonify({"message": f"Recurso com nome '{data['nome']}' já existe"}), 409
        
        # Criar novo recurso
        new_resource = Recurso(
            nome=data['nome'].strip(),
            tipo=data['tipo'].strip(),
            quantidade=int(data['quantidade']),
            valor_unit=float(data['valor_unit'])
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
    
    except ValueError as e:
        return jsonify({"message": "Dados inválidos fornecidos"}), 400
    except IntegrityError:
        db.rollback()
        return jsonify({"message": "Recurso com este nome já existe"}), 409
    except Exception as e:
        db.rollback()
        return jsonify({"message": f"Erro interno: {str(e)}"}), 500
    finally:
        db.close()

@resource_bp.route('/<int:resource_id>', methods=['GET'])
@jwt_required()
def get_resource(resource_id):
    """Buscar recurso específico por ID"""
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
            "valor_unit": resource.valor_unit,
            "created_at": resource.created_at.isoformat() if resource.created_at else None,
            "updated_at": resource.updated_at.isoformat() if resource.updated_at else None
        }), 200
    finally:
        db.close()

@resource_bp.route('/<int:resource_id>', methods=['PUT'])
@jwt_required()
def update_resource(resource_id):
    """Atualizar recurso (admin/gerente apenas)"""
    user_role = get_current_user_role()
    
    if user_role not in ['admin', 'gerente']:
        return jsonify({"message": "Permissão negada. Apenas admin e gerente podem editar recursos."}), 403
    
    db = SessionLocal()
    try:
        data = request.json
        if not data:
            return jsonify({"message": "Nenhum dado fornecido"}), 400
            
        resource = db.query(Recurso).filter_by(id=resource_id).first()
        if not resource:
            return jsonify({"message": "Recurso não encontrado"}), 404
        
        # Validações de dados
        if 'nome' in data:
            if not data['nome'].strip():
                return jsonify({"message": "Nome não pode estar vazio"}), 400
            # Verificar duplicação de nome (exceto o próprio recurso)
            existing = db.query(Recurso).filter(
                Recurso.nome == data['nome'].strip(),
                Recurso.id != resource_id
            ).first()
            if existing:
                return jsonify({"message": f"Já existe outro recurso com nome '{data['nome']}' "}), 409
            resource.nome = data['nome'].strip()
        
        if 'tipo' in data:
            if not data['tipo'].strip():
                return jsonify({"message": "Tipo não pode estar vazio"}), 400
            resource.tipo = data['tipo'].strip()
        
        if 'quantidade' in data:
            quantidade = int(data['quantidade'])
            if quantidade < 0:
                return jsonify({"message": "Quantidade não pode ser negativa"}), 400
            resource.quantidade = quantidade
        
        if 'valor_unit' in data:
            valor_unit = float(data['valor_unit'])
            if valor_unit <= 0:
                return jsonify({"message": "Valor unitário deve ser maior que zero"}), 400
            resource.valor_unit = valor_unit

        db.commit()
        db.refresh(resource)

        return jsonify({
            "id": resource.id,
            "nome": resource.nome,
            "tipo": resource.tipo,
            "quantidade": resource.quantidade,
            "valor_unit": resource.valor_unit,
            "updated_at": resource.updated_at.isoformat() if resource.updated_at else None
        }), 200
    
    except ValueError:
        return jsonify({"message": "Dados inválidos fornecidos"}), 400
    except IntegrityError:
        db.rollback()
        return jsonify({"message": "Conflito de dados"}), 409
    except Exception as e:
        db.rollback()
        return jsonify({"message": f"Erro interno: {str(e)}"}), 500
    finally:
        db.close()

@resource_bp.route("/<int:resource_id>", methods=["DELETE"])
@jwt_required()
def delete_resource(resource_id):
    """Deletar recurso (apenas admin)"""
    user_role = get_current_user_role()
    
    if user_role != 'admin':
        return jsonify({"message": "Permissão negada. Apenas admin pode deletar recursos."}), 403
    
    db = SessionLocal()
    try:
        resource = db.query(Recurso).filter_by(id=resource_id).first()
        if not resource:
            return jsonify({"message": "Recurso não encontrado"}), 404

        resource_name = resource.nome
        db.delete(resource)
        db.commit()
        
        return jsonify({
            "message": f"Recurso '{resource_name}' deletado com sucesso"
        }), 200
        
    except Exception as e:
        db.rollback()
        return jsonify({"message": f"Erro ao deletar recurso: {str(e)}"}), 500
    finally:
        db.close()

@resource_bp.route('/estatisticas', methods=['GET'])
@jwt_required()
def get_statistics():
    """Obter estatísticas dos recursos"""
    db = SessionLocal()
    try:
        recursos = db.query(Recurso).all()
        
        stats = {
            "total": len(recursos),
            "porTipo": {},
            "criticos": 0,
            "valorTotal": 0,
            "esgotados": 0,
            "baixoEstoque": 0
        }
        
        for recurso in recursos:
            # Contar por tipo
            tipo = recurso.tipo
            stats["porTipo"][tipo] = stats["porTipo"].get(tipo, 0) + 1
            
            # Contar críticos (< 5)
            if recurso.quantidade < 5:
                stats["criticos"] += 1
            
            # Contar esgotados
            if recurso.quantidade == 0:
                stats["esgotados"] += 1
            
            # Contar baixo estoque (5-9)
            if 5 <= recurso.quantidade < 10:
                stats["baixoEstoque"] += 1
            
            # Somar valor total
            stats["valorTotal"] += recurso.quantidade * recurso.valor_unit
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({"message": f"Erro ao calcular estatísticas: {str(e)}"}), 500
    finally:
        db.close()

@resource_bp.route('/tipos', methods=['GET'])
@jwt_required()
def get_tipos():
    """Obter todos os tipos únicos de recursos"""
    db = SessionLocal()
    try:
        tipos = db.query(Recurso.tipo).distinct().all()
        tipos_list = [tipo[0] for tipo in tipos if tipo[0]]
        tipos_list.sort()
        
        return jsonify(tipos_list), 200
        
    except Exception as e:
        return jsonify({"message": f"Erro ao buscar tipos: {str(e)}"}), 500
    finally:
        db.close()

@resource_bp.route('/criticos', methods=['GET'])
@jwt_required()
def get_recursos_criticos():
    """Buscar recursos com estoque crítico"""
    db = SessionLocal()
    try:
        limite = request.args.get('limite', default=5, type=int)
        recursos = db.query(Recurso).filter(Recurso.quantidade < limite).all()
        
        result = []
        for r in recursos:
            result.append({
                "id": r.id,
                "nome": r.nome,
                "tipo": r.tipo,
                "quantidade": r.quantidade,
                "valor_unit": r.valor_unit
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"message": f"Erro ao buscar recursos críticos: {str(e)}"}), 500
    finally:
        db.close()