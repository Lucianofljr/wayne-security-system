from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt, get_jwt_identity
from app import blacklisted_tokens

def create_tokens(user_id, user_data):
    additional_claims = {
        'name': user_data['name'],
        'email': user_data['email'],
        'cargo': user_data['cargo']
    }

    access_token = create_access_token(
        identity=user_id,
        additional_claims=additional_claims
    )

    refresh_token = create_refresh_token(identity=user_id)

    return {
        'access_token': access_token,
        'refresh_token': refresh_token
    }

def revoke_token():
    jti = get_jwt()['jti']
    blacklisted_tokens.add(jti)
    return True

def get_current_user_from_token():
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()

        return {
            'id': user_id,
            'name': claims.get('name'),
            'email': claims.get('email'),
            'cargo': claims.get('cargo')
        }
    
    except Exception:
        return None