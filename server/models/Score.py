from datetime import datetime

from ..db import db


class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), nullable=False)
    score = db.Column(db.integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
