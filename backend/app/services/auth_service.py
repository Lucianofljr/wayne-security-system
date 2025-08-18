from app.models import Usuario
from app.database import SessionLocal

def create_user(name, email, senha, cargo):
    db = SessionLocal()
    new_user = Usuario(
        name=name,
        email=email,
        cargo=cargo
    )
    new_user.set_senha(senha)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def login(email, senha):
    db = SessionLocal()
    user = db.query(Usuario).filter_by(email=email).first()
    if user and user.verificar_senha(senha):
        return user
    
    return None