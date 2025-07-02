import psycopg2
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import firestore
from firebase_admin import credentials

class Bdd:
    """
    classe de connexion a la bdd pgsql
    """
    def __init__(self, user, mdp, nom, host, port):
        self.user = user
        self.mdp = mdp
        self.nom = nom
        self.host = host
        self.port = port

    def connexion(self):
        """
        connexion a la bdd pgsql

        :return: None
        """
        try:
            self.conn = psycopg2.connect(
                database=self.nom,
                user=self.user,
                password=self.mdp,
                host=self.host,
                port=self.port,
            )
            self.cursor = self.conn.cursor()
            print("[INFO]: Bdd OK")
        except Exception as e:
            print(f"[ERREUR]: Bdd KO : {e}")

    def close(self):
        self.conn.close()
        self.cursor.close()
        print("[INFO]: Bdd close")

class Logs: 
    """
    classe de connexion a la bdd firebase 
    """
    def __init__(self, cle):
        self.cle = credentials.Certificate(cle)
        self.app = firebase_admin.initialize_app(self.cle)
        self.db = firestore.client()

load_dotenv()
con = Bdd(user=os.getenv("BDD_USER"), mdp=os.getenv("BDD_MDP"), nom=os.getenv("BDD_NOM"), host=os.getenv("BDD_HOST"), port=os.getenv("BDD_PORT"))
logs = Logs(cle="bdd/cle.json")
