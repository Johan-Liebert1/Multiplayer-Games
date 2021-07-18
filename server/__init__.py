import sys
from os import path

BASE_DIR = path.abspath(path.dirname(__file__))

sys.path.insert(0, BASE_DIR)

print(BASE_DIR)
