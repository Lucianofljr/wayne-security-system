from app.database import Base, engine
from app.models import Usuario, Recurso, Dashboard

if __name__ == "__main__":
    print("Criando tabelas no banco de dados...")
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas com sucesso!")