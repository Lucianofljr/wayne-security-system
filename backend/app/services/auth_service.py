from app.models import Usuario
from app.database import SessionLocal
from app.utils import set_senha, verificar_senha
from sqlalchemy.exc import IntegrityError

def create_user(user_data):
    db = SessionLocal()
    try:
        existing_user = db.query(Usuario).filter_by(email=user_data['email']).first()
        if existing_user:
            return {"message": "E-mail ja cadastrado", "Sucesso": False}
        
        new_user = Usuario(
            name=user_data['name'],
            email=user_data['email'],
            cargo=user_data['cargo'],
            senha_hash = set_senha(user_data['senha'])
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "Usuario criado com sucesso", "sucess": True}
    
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
            return {
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "cargo": user.cargo
                },
                "sucess": True
            }
    
        return {"message": "Credenciais invalidas", "sucess": False}
    
    finally:
        db.close()