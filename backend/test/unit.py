import unittest
import json
import sys
import os
from unittest.mock import MagicMock, patch
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from server import Serveur
from api.login.login import login
from api.register.register import register

class TesterServeur(unittest.TestCase):
    def cfg(self):
        self.server = Serveur(None, None, None)
        self.server.headers = {}
        self.server.send_response = MagicMock()
        self.server.send_header = MagicMock()
        self.server.end_headers = MagicMock()
        self.server.wfile = MagicMock()

    def test_endpoint(self):
        self.server.path = '/'
        self.server.do_GET()
        
        self.server.send_response.assert_called_with(200)
        self.server.wfile.write.assert_called_with('Serveur OK'.encode('utf-8'))

    def test_swagger_endpoint(self):
        self.server.path = '/swagger.json'
        self.server.do_GET()
        
        self.server.send_response.assert_called_with(200)
        self.server.send_header.assert_called_with('Content-type', 'application/json')

    def test_404(self):
        self.server.path = '/caca'
        self.server.do_GET()
        
        self.server.send_response.assert_called_with(404)
        self.server.wfile.write.assert_called_with(b'{"erreur": "pas trouve"}')

    @patch('api.login.login.login')
    def test_login(self, mock_login):
        mock_login.return_value = {'status': 200, 'message': 'Login successful'}
        
        self.server.path = '/login'
        self.server.headers = {'Content-Length': '2'}
        self.server.rfile = MagicMock()
        self.server.rfile.read.return_value = b'{}'
        
        self.server.do_POST()
        
        self.server.send_response.assert_called_with(200)
        mock_login.assert_called_once()

    def test_recuperer_parametres(self):
        self.server.path = '/test?param1=value1&param2=value2'
        path, params = self.server.recuperer_parametres()
        
        self.assertEqual(path, '/test')
        self.assertEqual(params['param1'], 'value1')
        self.assertEqual(params['param2'], 'value2')

class test_auth(unittest.TestCase):
    def test_login_existepas(self):
        result = login({'email': 'test@test.com', 'password': 'paslebonmdp'})
        self.assertIn('status', result)
        
    def test_register_vide(self):
        result = register({})
        self.assertIn('status', result)

if __name__ == '__main__':
    unittest.main()
