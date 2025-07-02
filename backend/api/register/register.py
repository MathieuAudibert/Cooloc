import sys
from pathlib import Path
import bcrypt
from datetime import datetime
projet_root = Path(__file__).resolve().parents[2]
sys.path.append(str(projet_root))
from bdd.connexion import con, logs

def mdp_hash(mdp):
    """
    hashe le mot de passe de l'utilisateur avec bcrypt

    :param mdp: str, mot de passe de l'utilisateur

    :return: str, mot de passe hashe
    """
    mdp_propre = mdp.encode('utf-8')
    salt = bcrypt.gensalt(12) # 12 --> eviter bruteforce ralentir l'algo
    mdp_hashe = bcrypt.hashpw(mdp_propre, salt)
    return mdp_hashe

def verifier_csrf(data):
    csrf = data['csrf']

    if not csrf:
        return {'status': 403, 'message': 'CSRF KO'}

    return {'status': 200, 'message': 'CSRF OK'}

def car_spe(mdp):
    """
    verifie que les mdp on au moins 1 caractere special

    :param mdp: str, mot de passe de l'utilisateur

    :return: bool, True si le mot de passe contient au moins un caractere special, False sinon
    """
    caracteres = "!@#$%^&*(),.?\":{}|<>"
    for c in caracteres:
        if c in mdp:
            return True
    return False

def register(data):
    champs = ['nom', 'prenom', 'mail', 'mdp']
    
    if not all(champ in data for champ in champs):
        return {'status': 400, 'message': 'Champs manquants'}

    csrf_verif = verifier_csrf(data)
    if csrf_verif['status'] != 200:
        return csrf_verif
    con.connexion()

    if not car_spe(data['mdp']):
        return {'status': 400, 'message': 'Car speciaux KO'}
    
    if len(data['mdp']) < 14:
        return {'status': 400, 'message': 'Mdp court'}

    mail_existant = "SELECT mail FROM Utilisateurs WHERE mail = %s"
    con.cursor.execute(mail_existant, (data['mail'],))
    
    if con.cursor.fetchone():
        return {'status': 400, 'message': 'Mail existant'}

    role = data.get('role', 'aucun')
    num_tel = data.get('num_telephone', None)
    mdp_hashe = mdp_hash(data['mdp'])
    
    requete = """INSERT INTO Utilisateurs (mail, nom, prenom, role, mdp, date_creation, num_telephone)VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    param = (data['mail'], data['nom'], data['prenom'], role, mdp_hashe, datetime.now(), num_tel)
    con.cursor.execute(requete, param)
    con.conn.commit()

    log = {'date': datetime.now(), 'action': 'inscription', 'mail': data['mail']}
    logs.db.collection('Logs').add(log)
        
    return {'status': 200}