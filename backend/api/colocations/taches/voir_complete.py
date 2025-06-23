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
    
    if token_decode['role'] not in ['colocataire', 'responsable', 'admin']:
        return {'status': 403, 'message': 'Role KO'}
    
    return {'status': 200, 'message': 'Token OK'}

def recup_id(data):
    mail = data['mail']
    requete = """SELECT id FROM Utilisateurs WHERE mail = %s LIMIT 1"""
    con.cursor.execute(requete, (mail,))
    result = con.cursor.fetchone()
    if result is None:
        return None
    return result[0]

def voir_tache_completer(data, token):
    con.connexion()

    id_utilisateur = recup_id(data)
    if not id_utilisateur:
        return {'status': 404, 'message': 'Utilisateur KO'}
    
    token_verif = verifier_token(data, token)
    if token_verif['status'] != 200:
        return token_verif

    requete = """SELECT t.* FROM Taches AS t JOIN Utilisateurs AS u ON t.createur = u.id JOIN Colocs AS c ON c.id = u.id_coloc WHERE c.id = %s AND t.cloture = 'true' ORDER BY t.date_crea DESC LIMIT 4;"""
    con.cursor.execute(requete, (data['id_coloc'],))
    taches = [
        {
            'id': row[0],
            'nom': row[1],
            'date_debut': row[2].strftime('%Y-%m-%d %H:%M:%S'),
            'date_fin': row[3].strftime('%Y-%m-%d %H:%M:%S'),
            'date_crea': row[4].strftime('%Y-%m-%d %H:%M:%S'),
            'priorite': row[5],
            'cloture': row[6],
            'createur': row[7],
            'attribue_a': row[8],
        } for row in con.cursor.fetchall()
    ]
    
    con.conn.commit()
    con.close()
    return {'status': 200, 'message': 'OK', 'taches': taches}