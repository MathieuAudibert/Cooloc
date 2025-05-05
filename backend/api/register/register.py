import os
import sys
from pathlib import Path
import jwt
import bcrypt
from datetime import datetime
projet_root = Path(__file__).resolve().parents[2]
sys.path.append(str(projet_root))
from bdd.connexion import con

jwt_secret = os.getenv("JWT")
jwt_algo = 'HS256'

def create_token(data):
    return jwt.encode(data, jwt_secret, algorithm=jwt_algo)

def mdp_hash(mdp):
    mdp_propre = mdp.encode('utf-8')
    salt = bcrypt.gensalt(12) # 12 --> eviter le bruteforce en ralentissant l'algo
    mdp_hashe = bcrypt.hashpw(mdp_propre, salt)
    return mdp_hashe

def register(data):
    champs = ['nom', 'prenom', 'mail', 'mdp']
    
    if not all(champ in data for champ in champs):
        return {'status': 400, 'message': 'Champs manquants'}

    con.connexion()
    
    mail_existant = "SELECT mail FROM Utilisateurs WHERE mail = %s"
    con.cursor.execute(mail_existant, (data['mail'],))
    
    if con.cursor.fetchone():
        return {'status': 400, 'message': 'Mail existant'}
    
    mdp_hashe = mdp_hash(data['mdp'])
    requete = """INSERT INTO Utilisateurs (mail, nom, prenom, role, mdp, date_creation, num_telephone)VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    param = (data['mail'], data['nom'], data['prenom'], data['role'], mdp_hashe, datetime.now(), data['num_telephone'])
    con.cursor.execute(requete, param)
    con.conn.commit()
    
    data_token = {"mail": data['mail'], "role": data['role']}
    token = create_token(data_token)
    
    con.conn.close()
    return {'status': 200, 'token': token}