from flask import Blueprint, jsonify, request
from app.database import SessionLocal
from app.models import Dashboard
from flask_jwt_extended import jwt_required, get_jwt_identity

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/', methods=['GET'])
@jwt_required
def get_dashboard():
    db = SessionLocal()
    try:
        
        dashboards = db.query(Dashboard).all()
        result = [
            {
                "id": d.id,
                "dadosSeguranca": d.dadosSeguranca,
                "dadosRecursos": d.dadosRecursos,
                "user_id": d.user_id,
                "created_at": d.created_at,
                "updated_at": d.updated_at,
            }
            for d in dashboards
        ]
        return jsonify(result), 200
    finally:
        db.close()

@dashboard_bp.route('/', methods=['POST'])
def create_dashboard():
    db = SessionLocal()
    try:
        data = request.json
        if not data or "user_id" not in data:
            return jsonify({"message": "O campo user_id e obrigatorio"}), 400
        
        new_dashboard = Dashboard(
            dadosSeguranca=data.get("dadosSeguranca"),
            dadosRecursos=data.get("dadosRecursos"),
            user_id=data["user_id"]
        )
        db.add(new_dashboard)
        db.commit()
        db.refresh(new_dashboard)

        return jsonify({
            "id": new_dashboard.id,
            "dadosSeguranca": new_dashboard.dadosSeguranca,
            "dadosRecursos": new_dashboard.dadosRecursos,
            "user_id": new_dashboard.user_id,
            "created_at": new_dashboard.created_at
        }), 201
    
    except Exception as e:
        db.rollback()
        return jsonify({"message": f"Erro ao criar dashboard: {str(e)}"}), 500
    finally:
        db.close()


@dashboard_bp.route('/<int:dashboard_id>', methods=['GET'])
def read_dashboard(dashboard_id):
    db = SessionLocal()
    try:
        dashboard = db.query(Dashboard).filter_by(id=dashboard_id).first()
        if not dashboard:
            return jsonify({"message": "Dashboard nao encontrado"}), 400
        
        return jsonify({
            "id": dashboard.id,
            "dadosSeguranca": dashboard.dadosSeguranca,
            "dadosRecursos": dashboard.dadosRecursos,
            "user_id": dashboard.user_id,
            "created_at": dashboard.created_at
        }), 200
    finally:
        db.close()
