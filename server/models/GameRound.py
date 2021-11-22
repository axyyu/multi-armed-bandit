from datetime import datetime

from ..db import db


class GameRound(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    game_id = db.Column(db.Integer, db.ForeignKey('game.id'))
    game = db.relationship('Game',
                           backref=db.backref('rounds', lazy=True))

    arm_choice = db.Column(db.Integer)
    recommendation = db.Column(db.Integer, nullable=True)
    observed_reward = db.Column(db.Float, nullable=True)
