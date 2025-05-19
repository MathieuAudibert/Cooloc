import os
import sys
import json
from http.server import HTTPServer, BaseHTTPRequestHandler

#Login/register
from api.login.login import login
from api.register.register import register

# candidature
from api.candidature.envoi.route import envoi_candidature
from api.candidature.maj.route import maj_candidature
from api.candidature.statut.route import statut_candidature
from api.candidature.suppression.route import supprimer_candidatures
from api.candidature.voir.route import voir_candidatures

# Coloc 
from api.colocations.creation import creer_coloc
from api.colocations.suppression import supprimer_coloc
from api.colocations.modifications import modifier_coloc

# autre
from api.roles.route import changer_role

HOST = "localhost"
PORT = 8000

class Serveur(BaseHTTPRequestHandler):

    def do_GET(self):
        get_data = self.rfile.read(int(self.headers['Content-Length']))
        data = json.loads(get_data)
        
        if self.path == '/candidature/voir':
            res = voir_candidatures(data, data['token'])
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
        
        elif self.path == '/role/modifier':
            res = changer_role(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))
            
        elif self.path == '/candidature/creer':
            res = envoi_candidature(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))
        
        elif self.path == '/candidature/supprimer':
            res = supprimer_candidatures(data, data['token'])
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

        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"erreur": "pas trouve"}')
    
    def do_PUT(self):
        post_data = self.rfile.read(int(self.headers['Content-Length']))
        data = json.loads(post_data)

        if self.path == '/coloc/modifier':
            res = modifier_coloc(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))
        
        elif self.path == '/candidature/maj/description':
            res = maj_candidature(data, data['token'])
            self.send_response(res['status'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif self.path == '/candidature/maj/statut':
            res = statut_candidature(data, data['token'])
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