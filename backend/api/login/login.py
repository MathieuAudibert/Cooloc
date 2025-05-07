import bcrypt
import jwt
import sys
import os
from pathlib import Path
racine = Path(__file__).resolve().parents[2]
sys.path.append(str(racine))
from bdd.connexion import con

jwt_secret = os.getenv("JWT")
jwt_algo = 'HS256'

def create_token(data):
    return jwt.encode({'mail': data['mail'], 'role': data['role']}, jwt_secret, algorithm=jwt_algo)

def mdp_hash(mdp):
    mdp_propre = mdp.encode('utf-8')
    salt = bcrypt.gensalt(12) # 12 --> eviter bruteforce ralentir l'algo
    mdp_hashe = bcrypt.hashpw(mdp_propre, salt)
    return mdp_hashe

def login(data):
    champs =  ['mail', 'mdp']
    
    if not all(champ in data for champ in champs):
        return {'status': 400, 'message': 'Champs manquants'}
    
    con.connexion()
    
    requete = """SELECT mail, mdp, role, prenom, nom FROM Utilisateurs WHERE mail = %s LIMIT 1"""
    con.cursor.execute(requete, (data['mail'],))
    utilisateur = con.cursor.fetchone()
    
    if not utilisateur:
        return {'status': 400, 'message': 'Utilisateur non trouvé'}
    
    mdp_fourni = data['mdp'].encode('utf-8')

    mdp = bytes.fromhex(utilisateur[1][2:])

    if not bcrypt.checkpw(mdp_fourni, mdp):
        return {'status': 400, 'message': 'Mot de passe incorrect'}
    
    token = create_token({'mail': utilisateur[0], 'role': utilisateur[2]})
    con.conn.close()
    return {'status': 200, 'data': {"mail": utilisateur[0], "role": utilisateur[2], "prenom": utilisateur[3], "nom": utilisateur[4] }, 'token': token} 