import secrets

def generer_csrf_token():
    return secrets.token_urlsafe(32)