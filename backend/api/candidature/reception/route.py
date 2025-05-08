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
        return {'status': 400, 'message': 'Token KO'}

    if token_decode['role'] != 'responsable' or 'proprietaire':
        return {'status': 403, 'message': 'Role KO'}
    
    return {'status': 200, 'message': 'Token OK'}

def recup_infos(utilisateur_id):
    requete = """SELECT mail, prenom, nom FROM Utilisateurs WHERE id = %s LIMIT 1"""
    con.cursor.execute(requete, (utilisateur_id,))
    utilisateur = con.cursor.fetchone()
    return utilisateur

""" a faire quand la colloc sera OK
def voir_candidatures(data, token):
    con.connexion()

    infos_utilisateur = recup_infos(data['id_utilisateur'])"""