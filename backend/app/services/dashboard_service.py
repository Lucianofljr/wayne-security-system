# backend/app/services/dashboard_service.py
from app.models import Recurso, Usuario, Alerta, Dashboard
from app.database import SessionLocal
from datetime import datetime, timedelta
from sqlalchemy import desc, func

def get_dashboard_data(user_id, user_cargo):
    """
    Obtém dados do dashboard baseado no usuário e cargo
    """
    db = SessionLocal()
    try:
        # Dados base para todos os usuários
        total_usuarios = db.query(Usuario).count()
        total_recursos = db.query(Recurso).count()
        recursos_criticos = db.query(Recurso).filter(Recurso.quantidade < 10).count()
        alertas_pendentes = db.query(Alerta). filter(Alerta.status == 'pendente').count()

        recent_activities = get_recent_activities(db, user_id, user_cargo)
        # Dados específicos por cargo
        if user_cargo == 'admin':
            alertas_nao_lidos = db.query(Alerta).filter(Alerta.status == 'nao_lido').count()
            recursos_valor_total = db.query(func.sum(Recurso.quantidade * Recurso.valor_unit)).scalar() or 0

            return {

                'stats': {
                    'total_usuarios': total_usuarios,
                    'total_recursos': total_recursos,
                    'recursos_criticos': recursos_criticos,
                    'alertas_pendentes': alertas_pendentes,
                    'alertas_nao_lidos': alertas_nao_lidos,
                    'valor_total_recursos': float(recursos_valor_total)
                },
                'recent_activity': recent_activities,
                'permissions': ['create', 'read', 'update', 'delete']
            }
            
        elif user_cargo == 'gerente':
            alertas_usuario = db.query(Alerta).filter(
                (Alerta.usuario_id == user_id) | (Alerta.usuario_id.is_(None))
            ).filter(Alerta.status == 'pendente').count()
            
            recursos_tipos = db.query(Recurso.tipo, func.count(Recurso.id)).group_by(Recurso.tipo).all()
            total_tipos = len(recursos_tipos)

            return {
                'stats': {
                    'total_recursos': total_recursos,
                    'recursos_criticos': recursos_criticos,
                    'alertas_pendentes': alertas_usuario,
                    'tipos_recursos': total_tipos 
                },
                'recent_activity': recent_activities,
                'permissions': ['create', 'read', 'update']
            }
            
        else:  # usuário comum
            # Recursos específicos do usuário (simulado)
            meus_alertas = db.query(Alerta).filter(Alerta.usuario_id == user_id).count()
            alertas_nao_lidos = db.query(Alerta).filter(
                Alerta.usuario_id == user_id,
                Alerta.status == 'nao_lido'
            ).count()

            return {
                'stats': {
                    'recursos_disponiveis': total_recursos,
                    'meus_alertas': meus_alertas,
                    'alertas_nao_lidos': alertas_nao_lidos,
                    'recursos_criticos_visiveis': recursos_criticos
                },
                'recent_activity': recent_activities,
                'permissions': ['read']
            }
    
    finally:
        db.close()

def get_recursos_summary(db, user_id, user_cargo):
    """
    Obtém resumo dos recursos no sistema
    """
    activities = []
    
    try:
        # Últimos recursos criados (últimos 7 dias)
        recent_date = datetime.utcnow() - timedelta(days=7)
        recent_recursos = db.query(Recurso).filter(
            Recurso.created_at >= recent_date
        ).order_by(desc(Recurso.created_at)).limit(5).all()
        
        for recurso in recent_recursos:
            activities.append(f"Recurso '{recurso.nome}' foi adicionado ao sistema")
        
        # Últimos alertas criados
        recent_alertas = db.query(Alerta).filter(
            Alerta.criado_em >= recent_date
        ).order_by(desc(Alerta.criado_em)).limit(3).all()
        
        for alerta in recent_alertas:
            activities.append(f"Alerta: {alerta.titulo}")
        
        # Últimos usuários cadastrados (só admin vê)
        if user_cargo == 'admin':
            recent_users = db.query(Usuario).filter(
                Usuario.created_at >= recent_date
            ).order_by(desc(Usuario.created_at)).limit(3).all()
            
            for user in recent_users:
                activities.append(f"Novo usuário '{user.name}' cadastrado")
        
        # Se não há atividades recentes, adiciona atividade do próprio usuário
        if not activities:
            current_user = db.query(Usuario).filter(Usuario.id == user_id).first()
            if current_user:
                activities.append(f"Login realizado por {current_user.name}")
        
        return activities[:10]  # Máximo 10 atividades
        
    except Exception as e:
        print(f"Erro ao buscar atividades: {e}")
        return ["Sistema inicializado", "Dados carregados com sucesso"]
    
def get_recent_activities(db, user_id, user_cargo):
    """
    Busca atividades recentes baseadas em dados reais do banco
    """
    activities = []
    
    try:
        # Últimos recursos criados (últimos 7 dias)
        recent_date = datetime.utcnow() - timedelta(days=7)
        recent_recursos = db.query(Recurso).filter(
            Recurso.created_at >= recent_date
        ).order_by(desc(Recurso.created_at)).limit(5).all()
        
        for recurso in recent_recursos:
            activities.append(f"Recurso '{recurso.nome}' foi adicionado ao sistema")
        
        # Últimos alertas criados
        recent_alertas = db.query(Alerta).filter(
            Alerta.criado_em >= recent_date
        ).order_by(desc(Alerta.criado_em)).limit(3).all()
        
        for alerta in recent_alertas:
            activities.append(f"Alerta: {alerta.titulo}")
        
        # Últimos usuários cadastrados (só admin vê)
        if user_cargo == 'admin':
            recent_users = db.query(Usuario).filter(
                Usuario.created_at >= recent_date
            ).order_by(desc(Usuario.created_at)).limit(3).all()
            
            for user in recent_users:
                activities.append(f"Novo usuário '{user.name}' cadastrado")
        
        # Se não há atividades recentes, adiciona atividade do próprio usuário
        if not activities:
            current_user = db.query(Usuario).filter(Usuario.id == user_id).first()
            if current_user:
                activities.append(f"Login realizado por {current_user.name}")
        
        return activities[:10]  # Máximo 10 atividades
        
    except Exception as e:
        print(f"Erro ao buscar atividades: {e}")
        return ["Sistema inicializado", "Dados carregados com sucesso"]


def get_recursos_summary():
    """
    Obtém resumo dos recursos no sistema - DADOS REAIS
    """
    db = SessionLocal()
    try:
        recursos = db.query(Recurso).all()
        
        summary = {
            'total': len(recursos),
            'por_tipo': {},
            'criticos': 0,
            'valor_total': 0,
            'recursos_recentes': []
        }
        
        for recurso in recursos:
            # Contar por tipo
            if recurso.tipo in summary['por_tipo']:
                summary['por_tipo'][recurso.tipo] += 1
            else:
                summary['por_tipo'][recurso.tipo] = 1
            
            # Contar críticos (quantidade baixa)
            if recurso.quantidade < 10:
                summary['criticos'] += 1
            
            # Somar valor total
            summary['valor_total'] += recurso.quantidade * recurso.valor_unit
        
        # Recursos mais recentes
        recursos_recentes = db.query(Recurso).order_by(
            desc(Recurso.created_at)
        ).limit(5).all()
        
        for recurso in recursos_recentes:
            summary['recursos_recentes'].append({
                'id': recurso.id,
                'nome': recurso.nome,
                'tipo': recurso.tipo,
                'quantidade': recurso.quantidade,
                'created_at': recurso.created_at.isoformat() if recurso.created_at else None
            })
        
        return summary
    
    finally:
        db.close()

def get_alertas_by_user(user_id, user_cargo):
    """
    Obtém alertas específicos do usuário baseado em dados reais
    """
    db = SessionLocal()
    try:
        if user_cargo == 'admin':
            # Admin vê todos os alertas
            alertas = db.query(Alerta).order_by(
                desc(Alerta.criado_em)
            ).limit(20).all()
        else:
            # Outros usuários veem seus alertas + alertas gerais
            alertas = db.query(Alerta).filter(
                (Alerta.usuario_id == user_id) | (Alerta.usuario_id.is_(None))
            ).order_by(desc(Alerta.criado_em)).limit(10).all()
        
        alertas_list = []
        for alerta in alertas:
            alertas_list.append({
                'id': alerta.id,
                'titulo': alerta.titulo,
                'descricao': alerta.descricao,
                'status': alerta.status,
                'prioridade': alerta.prioridade,
                'criado_em': alerta.criado_em.isoformat() if alerta.criado_em else None,
                'recurso_relacionado': alerta.recurso.nome if alerta.recurso else None
            })
        
        return alertas_list
    
    finally:
        db.close()

def create_automatic_alerts(db):
    """
    Cria alertas automáticos baseados em condições dos recursos
    """
    try:
        # Verifica recursos com estoque baixo
        recursos_baixo_estoque = db.query(Recurso).filter(Recurso.quantidade < 10).all()
        
        for recurso in recursos_baixo_estoque:
            # Verifica se já existe alerta para este recurso
            alerta_existente = db.query(Alerta).filter(
                Alerta.recurso_id == recurso.id,
                Alerta.status == 'pendente'
            ).first()
            
            if not alerta_existente:
                novo_alerta = Alerta(
                    titulo=f"Estoque baixo: {recurso.nome}",
                    descricao=f"O recurso '{recurso.nome}' está com apenas {recurso.quantidade} unidades em estoque.",
                    prioridade='alta' if recurso.quantidade < 5 else 'media',
                    recurso_id=recurso.id,
                    status='pendente'
                )
                db.add(novo_alerta)
        
        db.commit()
        return True
        
    except Exception as e:
        db.rollback()
        print(f"Erro ao criar alertas automáticos: {e}")
        return False
