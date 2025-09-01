from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.services.jwt_service import get_current_user_from_token
from app.services.dashboard_service import (
    get_dashboard_data, 
    get_recursos_summary, 
    get_alertas_by_user,
    create_automatic_alerts
)
from app.database import SessionLocal

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/", methods=["GET"])
@jwt_required()
def get_dashboard():
    try:
        user_data = get_current_user_from_token()
        
        if not user_data:
            return jsonify({
                "message": "Usuário não encontrado",
                "success": False
            }), 404

        # Criar alertas automáticos antes de buscar dados
        db = SessionLocal()
        create_automatic_alerts(db)
        db.close()

        # Buscar dados do dashboard baseado no usuário e cargo
        dashboard_data = get_dashboard_data(user_data['id'], user_data['cargo'])
        
        return jsonify({
            "message": "Dados do dashboard carregados com sucesso",
            "success": True,
            "data": dashboard_data,
            "user": user_data
        }), 200
    
    except Exception as e:
        return jsonify({
            "message": f"Erro interno: {str(e)}",
            "success": False
        }), 500


@dashboard_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_dashboard_stats():
    try:
        user_data = get_current_user_from_token()
        
        if not user_data:
            return jsonify({
                "message": "Usuário não encontrado",
                "success": False
            }), 404

        # Buscar estatísticas baseado no cargo
        stats_data = get_dashboard_data(user_data['id'], user_data['cargo'])
        
        return jsonify({
            "stats": stats_data['stats'],
            "user_role": user_data['cargo'],
            "success": True
        }), 200
    
    except Exception as e:
        return jsonify({
            "message": f"Erro interno: {str(e)}",
            "success": False
        }), 500


@dashboard_bp.route("/recursos", methods=["GET"])
@jwt_required()
def get_dashboard_recursos():
    try:
        user_data = get_current_user_from_token()
        
        if not user_data:
            return jsonify({
                "message": "Usuário não encontrado",
                "success": False
            }), 404

        # Buscar resumo dos recursos
        recursos_summary = get_recursos_summary()
        
        return jsonify({
            "message": "Recursos carregados com sucesso",
            "success": True,
            "data": recursos_summary
        }), 200
    
    except Exception as e:
        return jsonify({
            "message": f"Erro interno: {str(e)}",
            "success": False
        }), 500


@dashboard_bp.route("/alertas", methods=["GET"])
@jwt_required()
def get_dashboard_alertas():
    try:
        user_data = get_current_user_from_token()
        
        if not user_data:
            return jsonify({
                "message": "Usuário não encontrado",
                "success": False
            }), 404

        # Buscar alertas do usuário
        alertas = get_alertas_by_user(user_data['id'], user_data['cargo'])
        
        return jsonify({
            "message": "Alertas carregados com sucesso",
            "success": True,
            "data": alertas
        }), 200
    
    except Exception as e:
        return jsonify({
            "message": f"Erro interno: {str(e)}",
            "success": False
        }), 500


@dashboard_bp.route("/alertas/<int:alerta_id>/marcar-lido", methods=["POST"])
@jwt_required()
def marcar_alerta_lido(alerta_id):
    try:
        from app.models import Alerta
        from app.database import SessionLocal
        
        user_data = get_current_user_from_token()
        
        if not user_data:
            return jsonify({
                "message": "Usuário não encontrado",
                "success": False
            }), 404

        db = SessionLocal()
        try:
            alerta = db.query(Alerta).filter_by(id=alerta_id).first()
            
            if not alerta:
                return jsonify({
                    "message": "Alerta não encontrado",
                    "success": False
                }), 404
            
            # Verificar se o usuário pode marcar este alerta
            if alerta.usuario_id and alerta.usuario_id != user_data['id'] and user_data['cargo'] != 'admin':
                return jsonify({
                    "message": "Sem permissão para marcar este alerta",
                    "success": False
                }), 403
            
            alerta.status = 'lido'
            db.commit()
            
            return jsonify({
                "message": "Alerta marcado como lido",
                "success": True
            }), 200
        
        finally:
            db.close()
    
    except Exception as e:
        return jsonify({
            "message": f"Erro interno: {str(e)}",
            "success": False
        }), 500