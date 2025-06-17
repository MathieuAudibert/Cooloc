import sys
import os
from pathlib import Path
from datetime import datetime
import jwt
import bcrypt
projet_root = Path(__file__).resolve().parents[2]
sys.path.append(str(projet_root))
from bdd.connexion import con, logs

jwt_secret = os.getenv("JWT")
jwt_algo = 'HS256'

def mdp_hash(mdp):
    mdp_propre = mdp.encode('utf-8')
    salt = bcrypt.gensalt(12) # 12 --> eviter bruteforce ralentir l'algo
    mdp_hashe = bcrypt.hashpw(mdp_propre, salt)
    return mdp_hashe

def car_spe(mdp):
    caracteres = "!@#$%^&*(),.?\":{}|<>"
    for c in caracteres:
        if c in mdp:
            return True
    return False

def verifier_token(data, token):
    token_decode = jwt.decode(token, jwt_secret, algorithms=[jwt_algo])
    
    if token_decode['mail'] != data['mail']:
        return {'status': 403, 'message': 'Token KO - User not authorized to modify this profile'}
    
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

def maj_profil(data, token):
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

    champs = []
    val = []

    if 'nom' in data:
        champs.append('nom')
        val.append(data['nom'])
    if 'prenom' in data:
        champs.append('prenom')
        val.append(data['prenom'])
    if 'mail_modifie' in data:
        champs.append('mail')
        val.append(data['mail'])
    if 'mdp' in data:
        if not car_spe(data['mdp']):
            return {'status': 400, 'message': 'Car speciaux KO'}
        mdp_hashe = mdp_hash(data['mdp'])
        champs.append('mdp')
        val.append(mdp_hashe)
    if 'role_modifie' in data:
        champs.append('role')
        val.append(data['role'])
    if 'num_telephone' in data:
        champs.append('num_telephone')
        val.append(data['num_telephone'])
    
    val.append(data['id_utilisateur'])
    requete = f"""UPDATE Utilisateurs SET {', '.join([f"{champ} = %s" for champ in champs])} WHERE id = %s"""
    con.cursor.execute(requete, val)

    log = {'date': datetime.now(), 'action': 'maj utilisateur', 'id_utilisateur': id_utilisateur, 'champs': val}
    logs.db.collection('Logs').add(log)

    con.conn.commit()
    con.close()
    return {'status': 200, 'message': 'Utilisateur mis à jour avec succès'}

