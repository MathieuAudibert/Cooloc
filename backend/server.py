import os
import sys
import json
import mimetypes
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from swagger import swagger_spec

# inscription connexion 
from api.login.login import login
from api.register.register import register

# coloc 
from api.colocations.creation import creer_coloc
from api.colocations.suppression import supprimer_coloc
from api.colocations.gestion.renommer import modifier_coloc
from api.colocations.utilisateurs import details_colocs
from api.colocations.voir import infos_coloc
from api.colocations.gestion.ajouter_membres import ajouter_colocataires
from api.colocations.gestion.supprimer_membre import supprimer_membres
from api.colocations.taches.creation import creer_tache
from api.colocations.taches.suppression import supprimer_tache
from api.colocations.taches.voir import voir_tache
from api.colocations.taches.attribue import attribuer_tache
from api.colocations.taches.modifications import modifier_tache
from api.colocations.taches.cloturer import cloturer_tache
from api.colocations.taches.voir_complete import voir_tache_completer
from api.colocations.taches.miennes import voir_tache_miennes

# admin 
from api.adm.logi.supprimer import supprimer_logs
from api.adm.logi.voir import voir_logs
from api.adm.utilisateurs.voir import voir_utilisateurs
from api.adm.utilisateurs.maj import maj_utilisateurs
from api.adm.utilisateurs.supprimer import supprimer_utilisateurs

# autre
from api.roles.route import changer_role
from api.profil.route import maj_profil
from api.profil.voir import voir_profil
from api.tel.route import changer_tel

HOST = "localhost"
PORT = 8000

class Serveur(BaseHTTPRequestHandler):
    # FIX: elif ==> match case?
    def recuperer_parametres(self):
        url = urllib.parse.urlparse(self.path)
        path = url.path

        parametres = {}
        if url.query:
            req_parametres = urllib.parse.parse_qs(url.query)

            for cle, valeur in req_parametres.items():
                parametres[cle] = valeur[0]
        return path, parametres

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')  # More permissive for development
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')  # Allow all headers
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Max-Age', '3600')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        path, parametres = self.recuperer_parametres()

        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write('Serveur OK'.encode('utf-8'))

        elif self.path == '/swagger.json':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(swagger_spec).encode('utf-8'))
        
        elif self.path.startswith('/swagger-ui/'): 
            path = self.path[12:]

            if '../' in path: 
                self.send_response(403)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"erreur": "pas trouve"}')
                return

            pathc = os.path.join('swagger-ui', path)

            with open(pathc, 'rb') as fich:
                content = fich.read()

            mime_type = mimetypes.guess_type(pathc)[0] or 'application/octet-stream'
            self.send_response(200)
            self.send_header('Content-type', mime_type)
            self.end_headers()
            self.wfile.write(content)

        elif self.path == '/docs':
            self.send_response(302)
            self.send_header('Location', '/swagger-ui/index.html')
            self.end_headers()

        elif path == '/coloc/utilisateurs/voir':
            token = parametres.get('token')
            data = parametres.copy()

            res = details_colocs(data, token)
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif path == '/coloc/voir':
            token = parametres.get('token')
            data = parametres.copy()

            res = infos_coloc(data, token)
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif path == '/coloc/taches/voir-disponibles':
            token = parametres.get('token')
            data = parametres.copy()

            res = voir_tache(data, token)
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif path == '/coloc/taches/voir-completes':
            token = parametres.get('token')
            data = parametres.copy()

            res = voir_tache_completer(data, token)
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif path == '/coloc/taches/voir-miennes':
            token = parametres.get('token')
            data = parametres.copy()

            res = voir_tache_miennes(data, token)
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif path == '/profil/voir':
            token = parametres.get('token')
            data = parametres.copy()

            res = voir_profil(data, token)
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif path == '/adm/logs':
            token = parametres.get('token')
            data = parametres.copy()

            res = voir_logs(data, token)
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif path == '/adm/utilisateurs/voir':
            token = parametres.get('token')
            data = parametres.copy()

            res = voir_utilisateurs(data, token)
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))
            
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"erreur": "pas trouve"}')

    def do_POST(self):
        post_data = self.rfile.read(int(self.headers['Content-Length']))
        data = json.loads(post_data)
        
        if self.path == '/login':
            res = login(data)
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif self.path == '/register':
            res = register(data)
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif self.path == '/coloc/creer':
            res = creer_coloc(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif self.path == '/coloc/supprimer':
            res = supprimer_coloc(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif self.path == '/coloc/taches/creer':
            res = creer_tache(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif self.path == '/coloc/taches/supprimer':
            res = supprimer_tache(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))
        
        elif self.path == '/adm/logs/supprimer':
            res = supprimer_logs(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif self.path == '/adm/utilisateurs/supprimer':
            res = supprimer_utilisateurs(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"erreur": "pas trouve"}')
    
    def do_PUT(self):
        post_data = self.rfile.read(int(self.headers['Content-Length']))
        data = json.loads(post_data)

        if self.path == '/coloc/maj/nom':
            res = modifier_coloc(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif self.path == '/coloc/utilisateurs/ajouter':
            res = ajouter_colocataires(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif self.path == '/coloc/utilisateurs/supprimer':
            res = supprimer_membres(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif self.path == '/coloc/taches/attribuer':
            res = attribuer_tache(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif self.path == '/coloc/taches/cloturer':
            res = cloturer_tache(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif self.path == '/coloc/taches/maj/nom':
            res = modifier_tache(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))
        
        elif self.path == '/role/maj':
            res = changer_role(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif self.path == '/tel/maj':
            res = changer_tel(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif self.path == '/profil/maj':
            res = maj_profil(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif self.path == '/adm/utilisateurs/maj':
            res = maj_utilisateurs(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        else:   
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"erreur": "pas trouve"}')

serveur = HTTPServer((HOST, PORT), Serveur)
print(f'le serveur ecoute sur http://{HOST}:{PORT}')
serveur.serve_forever()
serveur.server_close()
print('stop')