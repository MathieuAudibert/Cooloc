import sys
import os
from pathlib import Path
from datetime import datetime
import jwt
projet_root = Path(__file__).resolve().parents[2]
sys.path.append(str(projet_root))
from bdd.connexion import con

jwt_secret = os.getenv("JWT")
jwt_algo = 'HS256'

def verifier_token(data, token):
    token_decode = jwt.decode(token, jwt_secret, algorithms=[jwt_algo])
    
    if token_decode['mail'] != data['mail'] and token_decode['role'] != data['role']:
        return {'status': 400, 'message': 'Token invalide'}
    
    return {'status': 200, 'message': 'Token valide'}

def recup_id(data) : 
    mail = data['mail']
    requete = """SELECT id FROM Utilisateurs WHERE mail = %s LIMIT 1"""
    con.cursor.execute(requete, (mail,))
    id_utilisateur = con.cursor.fetchone()
    return id_utilisateur

def changer_role(data, token):
    con.connexion()

    id_utilisateur = recup_id(data)
    if not id_utilisateur:
        return {'status': 400, 'message': 'Utilisateur non trouvé'}
    
    token_verif = verifier_token(data, token)
    if token_verif['status'] != 200:
        return token_verif
    
    requete = """UPDATE Utilisateurs SET role = %s WHERE id = %s"""
    param = (data['role'], id_utilisateur)
    con.cursor.execute(requete, param)
    con.conn.commit()

    con.conn.close()
    return {'status': 200, 'message': 'Role changé'}