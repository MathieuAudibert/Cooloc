import sys
import os
from pathlib import Path
from datetime import datetime
import jwt
projet_root = Path(__file__).resolve().parents[2]
sys.path.append(str(projet_root))
from bdd.connexion import con, logs

jwt_secret = os.getenv("JWT")
jwt_algo = 'HS256'

def verifier_token(data, token):
    token_decode = jwt.decode(token, jwt_secret, algorithms=[jwt_algo])
    
    if token_decode['mail'] != data['mail'] and token_decode['role'] != data['role']:
        return {'status': 403, 'message': 'Token KO'}
    
    if token_decode['role'] not in ['responsable', 'admin']:
        return {'status': 403, 'message': 'Role KO'}
    
    return {'status': 200, 'message': 'Token OK'}

def verifier_csrf(data):
    csrf = data['csrf']

    if not csrf:
        return {'status': 403, 'message': 'CSRF KO'}

    return {'status': 200, 'message': 'CSRF OK'}

def recup_id(data):
    mail = data['mail']
    requete = """SELECT id FROM Utilisateurs WHERE mail = %s LIMIT 1"""
    con.cursor.execute(requete, (mail,))
    result = con.cursor.fetchone()
    if result is None:
        return None
    return result[0]

def recup_id_coloc(data):
    mail = data['mail']
    requete = """SELECT id_coloc FROM Utilisateurs WHERE mail = %s LIMIT 1"""
    con.cursor.execute(requete, (mail,))
    id_coloc = con.cursor.fetchone()
    return id_coloc

def attribuer_tache(data, token): 
    con.connexion()

    id_utilisateur = recup_id(data)
    if not id_utilisateur:
        return {'status': 404, 'message': 'Utilisateur KO'}
    
    token_verif = verifier_token(data, token)
    if token_verif['status'] != 200:
        return token_verif
    
    csrf_verif = verifier_csrf(data)
    if csrf_verif['status'] != 200:
        return csrf_verif
    
    id_coloc = recup_id_coloc(data)
    if not id_coloc:
        return {'status': 404, 'message': 'Coloc KO'}

    id_attribue_a = data.get('attribue_a', None)
    if not id_attribue_a:
        return {'status': 400, 'message': 'utilisateur attribuer ko'}

    requete_check = """SELECT id FROM Utilisateurs WHERE id = %s LIMIT 1"""
    con.cursor.execute(requete_check, (id_attribue_a,))
    result_check = con.cursor.fetchone()
    if result_check is None:
        return {'status': 400, 'message': 'utilisateur attribué inexistant'}

    requete = """UPDATE Taches SET atribue_a = %s WHERE id = %s"""
    param = (id_attribue_a, data['id_tache'])
    con.cursor.execute(requete, param)
    
    log = {'date': datetime.now(), 'action': 'attribuer tache', 'id_utilisateur': id_utilisateur, 'id_coloc': id_coloc, 'id_tache': data['id_tache'], 'attribue_a': id_attribue_a}
    logs.db.collection('Logs').add(log)

    con.conn.commit()
    
    return {'status': 200, 'message': 'Tache attribuée avec succès'}