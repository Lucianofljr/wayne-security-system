# backend/app/services/dashboard_service.py
from app.models import Recurso, Usuario
from app.database import SessionLocal

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
        
        # Dados específicos por cargo
        if user_cargo == 'admin':
            
            return {
                alertas_pendentes = db.query(Alerta)
                'stats': {
                    'total_usuarios': total_usuarios,
                    'total_recursos': total_recursos,
                    'recursos_criticos': recursos_criticos,
                    'alertas_pendentes': 7
                },
                'recent_activity': [
                    'Novo usuário cadastrado',
                    'Recurso adicionado ao sistema',
                    'Alerta de estoque baixo',
                    'Backup realizado com sucesso'
                ],
                'permissions': ['create', 'read', 'update', 'delete']
            }
            
        elif user_cargo == 'gerente':
            return {
                'stats': {
                    'total_recursos': total_recursos,
                    'recursos_criticos': recursos_criticos,
                    'tarefas_pendentes': 12,
                    'relatorios_pendentes': 2
                },
                'recent_activity': [
                    'Relatório mensal gerado',
                    'Recurso atualizado',
                    'Aprovação de solicitação',
                    'Reunião de equipe agendada'
                ],
                'permissions': ['create', 'read', 'update']
            }
            
        else:  # usuário comum
            # Recursos específicos do usuário (simulado)
            meus_recursos = 5  # Isso viria de uma tabela de relacionamento
            
            return {
                'stats': {
                    'meus_recursos': meus_recursos,
                    'tarefas_pendentes': 3,
                    'notificacoes': 8,
                    'recursos_disponiveis': total_recursos
                },
                'recent_activity': [
                    'Login realizado',
                    'Recurso solicitado',
                    'Perfil atualizado',
                    'Notificação lida'
                ],
                'permissions': ['read']
            }
    
    finally:
        db.close()

def get_recursos_summary():
    """
    Obtém resumo dos recursos no sistema
    """
    db = SessionLocal()
    try:
        recursos = db.query(Recurso).all()
        
        summary = {
            'total': len(recursos),
            'por_tipo': {},
            'criticos': 0
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
        
        return summary
    
    finally:
        db.close()