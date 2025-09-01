from app.models import Usuario
from app.database import SessionLocal
from app.utils import set_senha, verificar_senha
from app.services.jwt_service import create_tokens
from sqlalchemy.exc import IntegrityError

def create_user(user_data):
    db = SessionLocal()
    try:
        existing_user = db.query(Usuario).filter_by(email=user_data['email']).first()
        if existing_user:
            return {"message": "E-mail ja cadastrado", "Sucesso": False}
        
        if len(user_data.get('senha', '')):
            return {
                "message": "Senha deve conter pelo menos 6 caracteres.",
                "success": False
            }
        
        if user_data.get('cargo') not in ['admin', 'usuario', 'gerente']:
            return {
                "message": "Cargo deve ser: admin, usuario ou gerente",
                "success": False
            }
        
        new_user = Usuario(
            name=user_data['name'],
            email=user_data['email'],
            cpf=user_data['cpf'],
            cargo=user_data['cargo'],
            senha_hash = set_senha(user_data['senha'])
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        user_info = {
            "name": new_user.name,
            "cpf": new_user.cpf,
            "email": new_user.email,
            "cargo": new_user.cargo
        }

        tokens = create_tokens(new_user.id, user_info)


        return {
            "message": "Usuario criado com sucesso",
            "sucess": True,
            "user": {
                "id": new_user.id,
                "name": new_user.name,
                "cpf": new_user.cpf,
                "email": new_user.email,
                "cargo": new_user.cargo
            },
            "token": tokens['access_token'],
            "refreshtoken": tokens['refresh_token']
            }
    
    except IntegrityError:
        db.rollback()
        return {"message": f"E-mail ja cadastrado", "success": False}
    
    except Exception as e:
        db.rollback()
        return {"message": f"Erro ao criar usuario: {str(e)}", "sucess": False}
    
    finally:
        db.close()

def authenticate_user(email, senha):
    db = SessionLocal()
    try:
        user = db.query(Usuario).filter_by(email=email).first()

        if user and verificar_senha(user.senha_hash, senha):

            user_info = {
                "name": user.name,
                "cpf": user.cpf,
                "email": user.email,
                "cargo": user.cargo
            }

            tokens = create_tokens(user.id, user_info)

            return {
                "message": "Login realizado com sucesso",
                "success": True,
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "cpf": user.cpf,
                    "email": user.email,
                    "cargo": user.cargo
                },
                "token": tokens['access_token'],
                "refreshtoken": tokens['refresh_token']
            }
    
        return {"message": "Credenciais invalidas", "sucess": False}
    
    finally:
        db.close()


def get_user_by_id(user_id):
    db = SessionLocal()
    try:
        user = db.query(Usuario).filter_by(id=user_id).first()

        if user:
            return {
                "id": user.id,
                "name": user.name,
                "cpf": user.cpf,
                "email": user.email,
                "cargo": user.cargo
            }
        
        return None
    
    finally:
        db.close()