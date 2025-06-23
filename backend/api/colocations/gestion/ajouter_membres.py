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

def recup_id(data) :
    mail = data['mail']
    requete = """SELECT id FROM Utilisateurs WHERE mail = %s LIMIT 1"""
    con.cursor.execute(requete, (mail,))
    id_utilisateur = con.cursor.fetchone()
    return id_utilisateur

def ajouter_colocataires(data, token):
    con.connexion()

    if not data.get('id_coloc'):
        return {'status': 400, 'message': 'Utilisateur KO'}

    id_utilisateur = recup_id(data)
    if not id_utilisateur:
        return {'status': 404, 'message': 'Utilisateur KO'}
    
    token_verif = verifier_token(data, token)
    if token_verif['status'] != 200:
        return token_verif
    
    csrf_verif = verifier_csrf(data)
    if csrf_verif['status'] != 200:
        return csrf_verif

    id_utilisateur_ajoute = data['id_utilisateur_ajoute']
    if isinstance(id_utilisateur_ajoute, str) and '@' in id_utilisateur_ajoute:
        requete_id = """SELECT id FROM Utilisateurs WHERE mail = %s LIMIT 1"""
        con.cursor.execute(requete_id, (id_utilisateur_ajoute,))
        result = con.cursor.fetchone()
        if not result:
            return {'status': 404, 'message': 'Utilisateur à ajouter non trouvé'}
        id_utilisateur_ajoute = result[0]

    requete = """UPDATE Utilisateurs SET id_coloc = %s WHERE id = %s"""
    con.cursor.execute(requete, (data['id_coloc'], id_utilisateur_ajoute))

    log = {'date': datetime.now(), 'action': 'ajout utilisateur coloc', 'id_utilisateur': id_utilisateur, 'id_utilisateur_ajoute': id_utilisateur_ajoute, 'id_coloc': data['id_coloc']}
    logs.db.collection('Logs').add(log)

    con.conn.commit()
    return {'status': 200, 'message': 'Utilisateur a été ajouté à la coloc.'}

