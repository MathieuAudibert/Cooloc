import pytest
from unittest.mock import MagicMock, patch

@pytest.fixture(autouse=True)
def mock_firebase():
    with patch('firebase_admin.initialize_app') as mock_init, \
         patch('firebase_admin.credentials.Certificate') as mock_cert, \
         patch('firebase_admin.firestore') as mock_firestore, \
         patch('psycopg2.connect') as mock_connect:
        
        mock_db = MagicMock()
        mock_firestore.client.return_value = mock_db
        mock_cert.return_value = MagicMock()
        mock_connect.return_value = MagicMock()
        yield {
            'init': mock_init,
            'cert': mock_cert,
            'firestore': mock_firestore,
            'db': mock_db,
            'connect': mock_connect
        } 