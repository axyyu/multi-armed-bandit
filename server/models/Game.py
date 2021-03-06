from datetime import datetime

from ..db import db


class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.String(256), db.ForeignKey('user.id'))
    user = db.relationship('User',
                           backref=db.backref('games', lazy=True))

    game_type = db.Column(db.String(256))  # base, observe, noObserve

    final_score = db.Column(db.Float)
    best_arm_guess = db.Column(db.Integer)
