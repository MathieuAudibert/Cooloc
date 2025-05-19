import jwt
import sys
import os
from datetime import datetime
from pathlib import Path
racine = Path(__file__).resolve().parents[2]
sys.path.append(str(racine))
from bdd.connexion import con

jwt_secret = os.getenv("JWT")
jwt_algo = 'HS256'

def verifier_token(data, token):
    token_decode = jwt.decode(token, jwt_secret, algorithms=[jwt_algo])
    
    if token_decode['mail'] != data['mail'] and token_decode['role'] != data['role']:
        return {'status': 403, 'message': 'Token KO'}

    if token_decode['role'] not in ['colocataire', 'proprietaire', 'responsable', 'admin']:
        return {'status': 403, 'message': 'Role KO'}
    
    return {'status': 200, 'message': 'Token OK'}

def verifier_csrf(data):
    csrf = data['csrf']

    if not csrf:
        return {'status': 403, 'message': 'CSRF KO'}

    return {'status': 200, 'message': 'CSRF OK'}

def recup_id(data) : 
    mail = data['mail']
    requete = """SELECT id FROM Utilisateurs WHERE mail = %s LIMIT 1"""
    con.cursor.execute(requete, (mail,))
    id_utilisateur = con.cursor.fetchone()
    return id_utilisateur

def maj_candidature(data, token):
    con.connexion()

    id_utilisateur = recup_id(data)
    if not id_utilisateur:
        return {'status': 400, 'message': 'Utilisateur KO'}
    
    token_verif = verifier_token(data, token)
    if token_verif['status'] != 200:
        return token_verif
    
    csrf_verif = verifier_csrf(data)
    if csrf_verif['status'] != 200:
        return csrf_verif

    description = data.get('description', '')

    requete = """UPDATE Candidatures (description) SET (%s) WHERE id = %s"""
    param = (description, data['id_candidature'])
    con.cursor.execute(requete, param)

    requete3 = """INSERT INTO Logs (date, action, id_utilisateur, id_candidature) VALUES (%s, %s, %s, %s)"""
    params = (datetime.now(), 'maj candidature', id_utilisateur, con.cursor.lastrowid)
    con.cursor.execute(requete3, params)
    
    con.conn.commit()
    con.conn.close()
    return {'status': 200, 'message': 'Candidature modifée avec succès'}