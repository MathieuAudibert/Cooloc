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
    
    if token_decode['mail'] != data['mail']:
        return {'status': 403, 'message': 'Token KO'}
    
    return {'status': 200, 'message': 'Token OK'}

def recup_id(data) :
    mail = data['mail']
    requete = """SELECT id FROM Utilisateurs WHERE mail = %s LIMIT 1"""
    con.cursor.execute(requete, (mail,))
    id_utilisateur = con.cursor.fetchone()
    return id_utilisateur

def voir_profil(data, token):
    con.connexion()

    id_utilisateur = recup_id(data)
    if not id_utilisateur:
        return {'status': 404, 'message': 'Utilisateur KO'}
    
    token_verif = verifier_token(data, token)
    if token_verif['status'] != 200:
        return token_verif

    requete = """SELECT id, mail, nom, prenom, role, date_creation, num_telephone, id_coloc FROM Utilisateurs WHERE id = %s"""
    con.cursor.execute(requete, (id_utilisateur,))
    utilisateurs = [
        {
            'id': row[0],
            'mail': row[1],
            'nom': row[2],
            'prenom': row[3],
            'role': row[4],
            'date_creation': row[5].strftime('%Y-%m-%d %H:%M:%S'),
            'num_telephone': row[6],
            'id_coloc': row[7]
        } for row in con.cursor.fetchall()
    ]
    
    con.conn.commit()
    return {'status': 200, 'infos': utilisateurs}

