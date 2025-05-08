import os
import sys
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from api.login.login import login
from api.register.register import register
from api.candidature.envoi.route import envoi_candidature
from api.roles.route import changer_role
from api.colocations.creation import creer_coloc
from api.colocations.suppression import supprimer_coloc

HOST = "localhost"
PORT = 8000

class Serveur(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(b"OK")

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

        elif self.path == '/demander/candidature':
            res = envoi_candidature(data, data['token'])
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

serveur = HTTPServer((HOST, PORT), Serveur)
print(f'le serveur ecoute sur http://{HOST}:{PORT}')
serveur.serve_forever()
serveur.server_close()
print('stop')