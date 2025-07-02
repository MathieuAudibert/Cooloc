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
    
    if token_decode['role'] not in ['admin']:
        return {'status': 403, 'message': 'Role KO'}
    
    return {'status': 200, 'message': 'Token OK'}

def recup_id(data):
    mail = data['mail']
    requete = """SELECT id FROM Utilisateurs WHERE mail = %s LIMIT 1"""
    con.cursor.execute(requete, (mail,))
    id_utilisateur = con.cursor.fetchone()
    return id_utilisateur

def voir_logs(data, token):
    con.connexion()

    id_utilisateur = recup_id(data)
    if not id_utilisateur:
        return {'status': 404, 'message': 'Utilisateur KO'}
    
    token_verif = verifier_token(data, token)
    if token_verif['status'] != 200:
        return token_verif

    logs_bdd = logs.db.collection('Logs').stream()
    # recupere TOUTEs les logs
    log = []
    for l in logs_bdd:
        log.append({
            'id': l.id,
            'date': l.to_dict().get('date').strftime('%Y-%m-%d %H:%M:%S'), # mets au bon format
            'action': l.to_dict().get('action'),
            'infos': {
                'id_coloc': l.to_dict().get('id_coloc'),
                'id_utilisateur': l.to_dict().get('id_utilisateur'),
                'id_logs': l.to_dict().get('id_logs')
            }
        })
    # transforme les objets de firebase en dict
    con.conn.commit()
    return {'status': 200, 'logs': log}

