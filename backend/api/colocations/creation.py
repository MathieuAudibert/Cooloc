import sys
from pathlib import Path
from datetime import datetime
projet_root = Path(__file__).resolve().parents[2]
sys.path.append(str(projet_root))
from bdd.connexion import con

