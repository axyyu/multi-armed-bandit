from flask import jsonify, render_template, request, session
import pickle
from server.algorithms import NoObserveSystem, ObserveSystem, SystemTypes

from .db import db
from .models.Score import Score

"""
Helper Functions
"""


# def _clear_game():
#     session.pop('game', None)
#     session.pop('gameType', None)


# def _save_game(system):
#     session['game'] = pickle.dump(system)


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
    game_type = SystemTypes[req['gameType']]
    num_arms = req['num_arms']
    num_interactions = req['num_interactions']

    # _clear_game()

    game = None
    if(game_type == SystemTypes.BASE):
        # session['gameType'] = 'BASE'
        pass
    elif(game_type == SystemTypes.OBSERVE):
        # session['gameType'] = 'OBSERVE'
        system = ObserveSystem(num_arms, num_interactions)
        # _save_game(system)
        game = pickle.dump(system)
    elif(game_type == SystemTypes.NO_OBSERVE):
        # session['gameType'] = 'NO_OBSERVE'
        system = NoObserveSystem(num_arms, num_interactions)
        # _save_game(system)
        game = pickle.dump(system)

    return jsonify({
        'game': game
    })


def recommend():
    """
    Get next recommendation
    """

    req = request.get_json()

    game_type = SystemTypes[req['gameType']]

    if game_type == SystemTypes.OBSERVE or game_type == SystemTypes.NO_OBSERVE:
        game = req['game']
        system = pickle.loads(game)

        return system.recommend()

    return False


def record():
    """
    Record user move
    """
    req = request.get_json()

    game_type = SystemTypes[req['gameType']]
    game = req['game']
    system = pickle.loads(game)

    arm_id = req['armId']
    decision = req['decision']

    if game_type == SystemTypes.OBSERVE:
        reward = req['reward']
        system.get_user_response(arm_id, decision, reward)
    elif game_type == SystemTypes.NO_OBSERVE:
        system.get_user_response(arm_id, decision)

    return True


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
