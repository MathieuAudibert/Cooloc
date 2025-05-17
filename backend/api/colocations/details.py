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
    
    if token_decode['role'] not in ['proprietaire', 'responsable', 'admin']:
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

def recup_infos_proprio(data) :
    coloc = data['id_colocs']
    requete = """SELECT u.nom, u.prenom, u.mail, u.num_telephone FROM Utilisateurs AS u JOIN Colocs AS c ON c.proprietaire = u.id WHERE mail = %s AND c.id = %s"""
    con.cursor.execute(requete, (data['mail'], coloc))
    id_utilisateur = con.cursor.fetchone()
    return id_utilisateur

def recup_infos(data): 
    coloc = data['id_colocs']
    requete = """SELECT u.nom, u.prenom FROM Utilisateurs AS u JOIN Colocs AS c ON c.id = u.id_coloc WHERE c.id = %s"""
    con.cursor.execute(requete, (coloc,))
    infos = con.cursor.fetchall()
    return infos

def recup_infos_coloc(data):
    coloc = data['id_colocs']
    requete = """SELECT c.nom, c.date_crea, u.prenom, u.nom FROM Colocs AS c JOIN Utilisateurs AS u ON c.responsable = u.id WHERE id = %s"""
    con.cursor.execute(requete, (coloc,))
    infos = con.cursor.fetchone()
    return infos

def details_colocs(data, token):
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

    infos_proprio = recup_infos_proprio(data['id_colocs'])
    infos_coloc = recup_infos_coloc(data['id_colocs'])
    infos = recup_infos(data['id_colocs'])

    return {'status': 200, 'message': 'OK', 'infos_proprio': infos_proprio, 'infos_coloc': infos_coloc, 'infos': infos}