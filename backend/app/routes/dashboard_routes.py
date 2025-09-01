from flask import Blueprint, jsonify, request
from app.database import SessionLocal
from app.models import Dashboard, Recurso, Usuario
from app.services.dashboard_service import get_dashboard_data
from app.services.jwt_service import get_current_user_from_token
from flask_jwt_extended import jwt_required, get_jwt_identity

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/', methods=['GET'])
@jwt_required()
def get_dashboard():
    try:
        user_data = get_current_user_from_token()
        if not user_data:
            return jsonify({"message": "Usuário não encontrado"}), 404
        
        # Usar o serviço de dashboard
        dashboard_data = get_dashboard_data(user_data['id'], user_data['cargo'])
        
        return jsonify({
            "success": True,
            "data": dashboard_data
        }), 200
        
    except Exception as e:
        return jsonify({"message": f"Erro interno: {str(e)}"}), 500

@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        user_data = get_current_user_from_token()
        if not user_data:
            return jsonify({"message": "Usuário não encontrado"}), 404
        
        # Obter estatísticas baseadas no cargo
        dashboard_data = get_dashboard_data(user_data['id'], user_data['cargo'])
        
        return jsonify({
            "stats": dashboard_data['stats'],
            "user_role": user_data['cargo']
        }), 200
        
    except Exception as e:
        return jsonify({"message": f"Erro interno: {str(e)}"}), 500

@dashboard_bp.route('/', methods=['POST'])
@jwt_required()
def create_dashboard():
    db = SessionLocal()
    try:
        user_data = get_current_user_from_token()
        data = request.json
        
        new_dashboard = Dashboard(
            dadosSeguranca=data.get("dadosSeguranca"),
            dadosRecursos=data.get("dadosRecursos"),
            user_id=user_data['id']
        )
        db.add(new_dashboard)
        db.commit()
        db.refresh(new_dashboard)

        return jsonify({
            "id": new_dashboard.id,
            "dadosSeguranca": new_dashboard.dadosSeguranca,
            "dadosRecursos": new_dashboard.dadosRecursos,
            "user_id": new_dashboard.user_id,
            "created_at": new_dashboard.created_at.isoformat() if new_dashboard.created_at else None
        }), 201
    
    except Exception as e:
        db.rollback()
        return jsonify({"message": f"Erro ao criar dashboard: {str(e)}"}), 500
    finally:
        db.close()