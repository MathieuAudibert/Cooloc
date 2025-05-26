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

def creer_coloc(data, token):
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

    coloc = """SELECT id_coloc FROM Utilisateurs WHERE id = %s"""
    a_coloc = con.cursor.execute(coloc, (id_utilisateur,))
    
    if a_coloc:
        return {'status': 403, 'message': 'Utilisateur déjà dans une coloc'}

    requete = """INSERT INTO Colocs (nom, date_crea, responsable) VALUES (%s, %s, %s) RETURNING id"""
    param = (data['nom'], datetime.now(), id_utilisateur)
    con.cursor.execute(requete, param)
    id_coloc = con.cursor.fetchone()

    if not id_coloc:
        return {'status': 500, 'message': 'Erreur interne'}
    
    requete2 = """UPDATE Utilisateurs SET id_coloc = %s WHERE id = %s"""
    con.cursor.execute(requete2, (id_coloc, id_utilisateur))

    log = {'date': datetime.now(), 'action': 'creation coloc', 'id_utilisateur': id_utilisateur, 'id_coloc': id_coloc}
    logs.db.collection('Logs').add(log)
    
    con.conn.commit()
    con.conn.close()
    return {'status': 200, 'message': 'coloc crée'}