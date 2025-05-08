import sys
from pathlib import Path
import bcrypt
from datetime import datetime
projet_root = Path(__file__).resolve().parents[2]
sys.path.append(str(projet_root))
from bdd.connexion import con

def mdp_hash(mdp):
    mdp_propre = mdp.encode('utf-8')
    salt = bcrypt.gensalt(12) # 12 --> eviter bruteforce ralentir l'algo
    mdp_hashe = bcrypt.hashpw(mdp_propre, salt)
    return mdp_hashe

def verifier_csrf(data):
    csrf = data['csrf']

    if not csrf:
        return {'status': 403, 'message': 'CSRF KO'}

    return {'status': 200, 'message': 'CSRF OK'}

def register(data):
    champs = ['nom', 'prenom', 'mail', 'mdp']
    
    if not all(champ in data for champ in champs):
        return {'status': 400, 'message': 'Champs manquants'}

    con.connexion()
    
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
        
    con.conn.close()
    return {'status': 200}