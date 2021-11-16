from flask import jsonify, render_template, request
from server.algorithms import NoObserveSystem, ObserveSystem, SystemTypes

from .db import db
from .models.Score import Score

"""
Controllers
"""


def home():
    return render_template('index.html')


def start():
    """
    Start game
    """
    req = request.get_json()
    game_type = SystemTypes(req['gameType'])
    num_arms = req['numArms']
    num_interactions = req['numInteractions']

    game = None
    recommend = None
    if(game_type == SystemTypes.OBSERVE):
        system = ObserveSystem(num_arms, num_interactions)
        recommend = system.recommend()
        game = system.serialize()
    elif(game_type == SystemTypes.NO_OBSERVE):
        system = NoObserveSystem(num_arms, num_interactions)
        recommend = system.recommend()
        game = system.serialize()

    return jsonify({
        'game': game,
        'recommend': recommend
    })


def recommend():
    """
    Get next recommendation
    """

    req = request.get_json()

    game_type = SystemTypes(req['gameType'])
    game = req['game']

    recommend = None

    if game_type == SystemTypes.OBSERVE:
        system = ObserveSystem.deserialize(game)
        recommend = system.recommend()
        game = system.serialize()
    elif game_type == SystemTypes.NO_OBSERVE:
        system = NoObserveSystem.deserialize(game)
        recommend = system.recommend()
        game = system.serialize()

    return jsonify({
        'game': game,
        'recommend': recommend
    })


def record():
    """
    Record user move
    """
    req = request.get_json()

    game_type = SystemTypes(req['gameType'])
    game = req['game']
    arm_id = req['armId']
    decision = req['decision']

    recommend = None

    if game_type == SystemTypes.OBSERVE:
        system = ObserveSystem.deserialize(game)
        reward = req['reward']
        system.get_user_response(arm_id, decision, reward)
        recommend = system.recommend()
        game = system.serialize()
    elif game_type == SystemTypes.NO_OBSERVE:
        system = NoObserveSystem.deserialize(game)
        system.get_user_response(arm_id, decision)
        recommend = system.recommend()
        game = system.serialize()

    return jsonify({
        'game': game,
        'recommend': recommend
    })


def score():
    """
    Add a new score entry
    """
    # req = request.get_json()

    # title = req["title"]
    # score = req["score"]

    # score = Score(title=title, score=score)

    # db.session.add(score)
    # db.session.commit()

    return True


def leaderboard():
    """
    Return existing top scores
    """
    # scores = Score.query.limit(10).all()

    # return jsonify({
    #     "scores": scores
    # })
    return True
