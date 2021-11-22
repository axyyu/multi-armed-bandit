from datetime import datetime

from ..db import db


class User(db.Model):
    id = db.Column(db.String(256), primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
