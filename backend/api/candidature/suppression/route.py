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

def supprimer_candidatures(data, token):
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

    requete = """DELETE FROM Colocs_Candidatures WHERE id_candidatures = %s"""
    con.cursor.execute(requete, (data['id_candidature'],))

    requete2 = """DELETE FROM Candidatures WHERE id = %s"""
    con.cursor.execute(requete2, (data['id_candidature'],))
    
    requete3 = """INSERT INTO Logs (date, action, id_utilisateur, id_coloc) VALUES (%s, %s, %s, %s)"""
    params = (datetime.now(), 'suppression candidature', id_utilisateur, data['id_candidature'])
    con.cursor.execute(requete3, params)
    
    con.conn.commit()
    con.conn.close()    
    return {'status': 200, 'message': 'Candidature supprimée avec succès'}