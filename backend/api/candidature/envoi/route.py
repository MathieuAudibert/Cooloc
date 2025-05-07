import jwt
import sys
import os
from pathlib import Path
racine = Path(__file__).resolve().parents[2]
sys.path.append(str(racine))
from bdd.connexion import con

jwt_secret = os.getenv("JWT")
jwt_algo = 'HS256'

def verifier_token(data, token):
    token_decode = jwt.decode(token, jwt_secret, algorithms=[jwt_algo])
    
    if token_decode['mail'] != data['mail'] and token_decode['role'] != data['role']:
        return {'status': 400, 'message': 'Token invalide'}

    if token_decode['role'] != 'aucun':
        return {'status': 403, 'message': 'Role invalide'}
    
    return {'status': 200, 'message': 'Token valide'}

def recup_id(data) : 
    mail = data['mail']
    requete = """SELECT id FROM Utilisateurs WHERE mail = %s LIMIT 1"""
    con.cursor.execute(requete, (mail,))
    id_utilisateur = con.cursor.fetchone()
    return id_utilisateur

def envoi_candidature(data, token):
    con.connexion()

    id_utilisateur = recup_id(data)
    if not id_utilisateur:
        return {'status': 400, 'message': 'Utilisateur non trouvé'}
    
    token_verif = verifier_token(data, token)
    if token_verif['status'] != 200:
        return token_verif
    
    description = data.get('description', '')

    requete = """INSERT INTO Candidatures (description, statut, id_utilisateur) VALUES (%s, %s, %s)"""
    param = (description, 'en-attente', id_utilisateur)
    con.cursor.execute(requete, param)
    con.conn.commit()

    requete2 = """INSERT INTO Colocs_Candidatures (id_colocs, id_candidatures) VALUES (%s, %s)"""
    param2 = (data['id_coloc'], con.cursor.lastrowid)
    con.cursor.execute(requete2, param2)

    con.conn.close()
    return {'status': 200, 'message': 'Candidature envoyée avec succès'}