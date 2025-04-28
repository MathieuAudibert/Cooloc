import psycopg2
import os
from dotenv import load_dotenv

class Bdd: 
    def __init__(self, bdd_nom, bdd_port, bdd_host, bdd_user, bdd_mdp):
        self.bdd_nom = bdd_nom
        self.bdd_port = bdd_port
        self.bdd_host = bdd_host
        self.bdd_user = bdd_user
        self.bdd_mdp = bdd_mdp

    def con(self):
        try:
            self.connexion = psycopg2.connect(
                database=self.bdd_nom,
                port=self.bdd_port,
                host=self.bdd_host,
                user=self.bdd_user,
                password=self.bdd_mdp
            )
            self.cursor = self.connexion.cursor()
            print("[INFO]: Connexion a la bdd OK")
        except Exception as e:
            print("[ERREUR]: Connexion a la bdd KO")

    def req(self, req):
        self.cursor.execute(req)
        self.connexion.commit()
        return self.cursor
    
    def close(self):
        self.connexion.close()
        self.cursor.close()
        print("[INFO]: Deconnexion de la bdd OK")

load_dotenv()
con = Bdd(
    bdd_nom=os.getenv("BDD_NOM"),
    bdd_port=os.getenv("BDD_PORT"),
    bdd_host=os.getenv("BDD_HOST"),
    bdd_user=os.getenv("BDD_USER"),
    bdd_mdp=os.getenv("BDD_MDP")
)

# Test
con.con()