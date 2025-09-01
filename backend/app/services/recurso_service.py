# backend/app/services/recurso_service.py
from app.models import Recurso
from app.database import SessionLocal
from datetime import datetime

def create_recurso(recurso_data):
    """
    Cria um novo recurso
    """
    db = SessionLocal()
    try:
        # Validações
        if recurso_data.get('quantidade', 0) < 0:
            return {
                "message": "Quantidade não pode ser negativa",
                "success": False
            }
        
        if not recurso_data.get('nome', '').strip():
            return {
                "message": "Nome do recurso é obrigatório",
                "success": False
            }
        
        # Verificar se já existe recurso com o mesmo nome
        existing_recurso = db.query(Recurso).filter_by(nome=recurso_data['nome']).first()
        if existing_recurso:
            return {
                "message": "Recurso com este nome já existe",
                "success": False
            }
        
        # Criar novo recurso
        new_recurso = Recurso(
            nome=recurso_data['nome'].strip(),
            tipo=recurso_data['tipo'].strip(),
            quantidade=int(recurso_data['quantidade'])
        )
        
        db.add(new_recurso)
        db.commit()
        db.refresh(new_recurso)
        
        return {
            "message": "Recurso criado com sucesso",
            "success": True,
            "recurso": {
                "id": new_recurso.id,
                "nome": new_recurso.nome,
                "tipo": new_recurso.tipo,
                "quantidade": new_recurso.quantidade,
                "created_at": new_recurso.created_at.isoformat() if new_recurso.created_at else None
            }
        }
        
    except Exception as e:
        db.rollback()
        return {
            "message": f"Erro ao criar recurso: {str(e)}",
            "success": False
        }
    
    finally:
        db.close()

def get_all_recursos():
    """
    Obtém todos os recursos
    """
    db = SessionLocal()
    try:
        recursos = db.query(Recurso).all()
        
        return [
            {
                "id": recurso.id,
                "nome": recurso.nome,
                "tipo": recurso.tipo,
                "quantidade": recurso.quantidade,
                "status": "crítico" if recurso.quantidade < 10 else "normal",
                "created_at": recurso.created_at.isoformat() if recurso.created_at else None,
                "updated_at": recurso.updated_at.isoformat() if recurso.updated_at else None
            }
            for recurso in recursos
        ]
    
    finally:
        db.close()

def get_recurso_by_id(recurso_id):
    """
    Obtém um recurso específico por ID
    """
    db = SessionLocal()
    try:
        recurso = db.query(Recurso).filter_by(id=recurso_id).first()
        
        if not recurso:
            return None
        
        return {
            "id": recurso.id,
            "nome": recurso.nome,
            "tipo": recurso.tipo,
            "quantidade": recurso.quantidade,
            "status": "crítico" if recurso.quantidade < 10 else "normal",
            "created_at": recurso.created_at.isoformat() if recurso.created_at else None,
            "updated_at": recurso.updated_at.isoformat() if recurso.updated_at else None
        }
    
    finally:
        db.close()

def update_recurso(recurso_id, update_data):
    """
    Atualiza um recurso existente
    """
    db = SessionLocal()
    try:
        recurso = db.query(Recurso).filter_by(id=recurso_id).first()
        
        if not recurso:
            return {
                "message": "Recurso não encontrado",
                "success": False
            }
        
        # Validações
        if 'quantidade' in update_data and update_data['quantidade'] < 0:
            return {
                "message": "Quantidade não pode ser negativa",
                "success": False
            }
        
        # Verificar nome duplicado (se nome está sendo alterado)
        if 'nome' in update_data and update_data['nome'] != recurso.nome:
            existing_recurso = db.query(Recurso).filter_by(nome=update_data['nome']).first()
            if existing_recurso:
                return {
                    "message": "Recurso com este nome já existe",
                    "success": False
                }
        
        # Atualizar campos
        for field, value in update_data.items():
            if hasattr(recurso, field) and field != 'id':
                if field in ['nome', 'tipo'] and isinstance(value, str):
                    value = value.strip()
                elif field == 'quantidade':
                    value = int(value)
                
                setattr(recurso, field, value)
        
        recurso.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(recurso)
        
        return {
            "message": "Recurso atualizado com sucesso",
            "success": True,
            "recurso": {
                "id": recurso.id,
                "nome": recurso.nome,
                "tipo": recurso.tipo,
                "quantidade": recurso.quantidade,
                "status": "crítico" if recurso.quantidade < 10 else "normal",
                "updated_at": recurso.updated_at.isoformat()
            }
        }
        
    except Exception as e:
        db.rollback()
        return {
            "message": f"Erro ao atualizar recurso: {str(e)}",
            "success": False
        }
    
    finally:
        db.close()

def delete_recurso(recurso_id):
    """
    Remove um recurso (apenas admin)
    """
    db = SessionLocal()
    try:
        recurso = db.query(Recurso).filter_by(id=recurso_id).first()
        
        if not recurso:
            return {
                "message": "Recurso não encontrado",
                "success": False
            }
        
        recurso_info = {
            "id": recurso.id,
            "nome": recurso.nome,
            "tipo": recurso.tipo
        }
        
        db.delete(recurso)
        db.commit()
        
        return {
            "message": f"Recurso '{recurso_info['nome']}' removido com sucesso",
            "success": True,
            "deleted_recurso": recurso_info
        }
        
    except Exception as e:
        db.rollback()
        return {
            "message": f"Erro ao remover recurso: {str(e)}",
            "success": False
        }
    
    finally:
        db.close()

def get_recursos_by_tipo(tipo):
    """
    Obtém recursos filtrados por tipo
    """
    db = SessionLocal()
    try:
        recursos = db.query(Recurso).filter_by(tipo=tipo).all()
        
        return [
            {
                "id": recurso.id,
                "nome": recurso.nome,
                "tipo": recurso.tipo,
                "quantidade": recurso.quantidade,
                "status": "crítico" if recurso.quantidade < 10 else "normal"
            }
            for recurso in recursos
        ]
    
    finally:
        db.close()

def get_recursos_criticos():
    """
    Obtém recursos com estoque crítico (quantidade < 10)
    """
    db = SessionLocal()
    try:
        recursos = db.query(Recurso).filter(Recurso.quantidade < 10).all()
        
        return [
            {
                "id": recurso.id,
                "nome": recurso.nome,
                "tipo": recurso.tipo,
                "quantidade": recurso.quantidade,
                "status": "crítico"
            }
            for recurso in recursos
        ]
    
    finally:
        db.close()