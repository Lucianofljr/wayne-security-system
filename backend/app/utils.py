from werkzeug.security import generate_password_hash, check_password_hash


def set_senha(senha):
    return generate_password_hash(senha)

def verificar_senha(hash_senha, senha):
    return check_password_hash(hash_senha, senha)