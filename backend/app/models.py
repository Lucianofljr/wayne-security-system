from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from app.database import Base, engine

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    cpf = Column(String, unique=True, nullable=False)
    senha_hash = Column(String, nullable=False)
    cargo = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    alertas = relationship("Alerta", back_populates="usuario")

    def __repr__(self):
        return f"<Usuario(id={self.id}, email={self.email}, Cpf={self.cpf}, cargo={self.cargo}>)"


class Recurso(Base):
    __tablename__ = "recursos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    tipo = Column(String, nullable=False)
    quantidade = Column(Integer, nullable=False)
    valor_unit = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    alertas = relationship("Alerta", back_populates="recurso")




class Dashboard(Base):
    __tablename__ = "dashboards"

    id = Column(Integer, primary_key=True, index=True)
    dadosSeguranca = Column(String)
    dadosRecursos = Column(String)
    user_id = Column(Integer, ForeignKey("usuarios.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    usuario = relationship("Usuario", backref="dashboards")

class Alerta(Base):
    __tablename__ = "alerta"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(100), nullable=False)  # Ex: "Estoque baixo"
    descricao = Column(String(255), nullable=True)  # Detalhe do alerta
    status = Column(Enum("pendente", "resolvido", "nao_lido", "lido", name="status_alerta"), default="pendente")
    
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)  
    usuario = relationship("Usuario", back_populates="alertas")

    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    prioridade = Column(Enum("baixa", "media", "alta", "critica", name="prioridade_alerta"), default="baixa")

    # Exemplo: se for relacionado a um recurso específico
    recurso_id = Column(Integer, ForeignKey("recursos.id"), nullable=True)
    recurso = relationship("Recurso", back_populates="alertas")