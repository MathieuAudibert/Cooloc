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
    if token_decode['mail'] != data['mail']:
        return {'status': 403, 'message': 'Token KO'}
    return {'status': 200, 'message': 'Token OK'}

def verifier_csrf(data):
    csrf = data.get('csrf')
    if not csrf:
        return {'status': 403, 'message': 'CSRF KO'}
    return {'status': 200, 'message': 'CSRF OK'}

def recup_id(data):
    mail = data['mail']
    requete = """SELECT id FROM Utilisateurs WHERE mail = %s LIMIT 1"""
    con.cursor.execute(requete, (mail,))
    id_utilisateur = con.cursor.fetchone()
    return id_utilisateur[0] if id_utilisateur else None

def supprimer_profil(data, token):
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
    requete = """DELETE FROM Utilisateurs WHERE id = %s"""
    con.cursor.execute(requete, (id_utilisateur,))
    log = {'date': datetime.now(), 'action': 'suppression profil', 'id_utilisateur': id_utilisateur}
    logs.db.collection('Logs').add(log)
    con.conn.commit()
    return {'status': 200, 'message': 'Compte supprimé avec succès'} 