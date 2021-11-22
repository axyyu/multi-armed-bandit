from datetime import datetime

from ..db import db


class Arm(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    game_id = db.Column(db.Integer, db.ForeignKey('game.id'))
    game = db.relationship('Game',
                           backref=db.backref('queries', lazy=True))

    index = db.Column(db.Integer)
    mean = db.Column(db.Float)
    variance = db.Column(db.Float)
