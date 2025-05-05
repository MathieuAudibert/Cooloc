import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler

HOST = "localhost"
PORT = 8000

class Serveur(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(b"Hello, world!")

    def do_POST(self):
        if self.path == '/login':
            self.send_header('Content-type', 'application/json')
            
            self.end_headers()

serveur = HTTPServer((HOST, PORT), Serveur)
print(f'le serveur ecoute sur http://{HOST}:{PORT}')
serveur.serve_forever()
serveur.server_close()
print('stop')