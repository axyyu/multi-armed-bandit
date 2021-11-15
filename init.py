from server import create_app
from server.db import db

db.create_all(app=create_app())
