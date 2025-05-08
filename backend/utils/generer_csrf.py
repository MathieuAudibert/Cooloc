import secrets

def generer_csrf_token():
    return secrets.token_urlsafe(32)

if __name__ == "__main__":
    print(generer_csrf_token())