from flask import current_app, jsonify, request, send_from_directory

from server.algorithms import NoObserveSystem, ObserveSystem, SystemTypes
from server.helpers import get_user

from .db import db
from .models import *

"""
Controllers
"""


def home():
    print(current_app.static_folder)
    return send_from_directory(current_app.static_folder, 'index.html')


def start():
    """
    Start game
    """
    req = request.get_json()

    user_id = req['userId']
    arms = req['arms']
    game_type = SystemTypes(req['gameType'])
    num_arms = req['numArms']
    num_interactions = req['numInteractions']

    print(req)

    # add game to database
    user = get_user(user_id)
    game_obj = Game(user=user,
                    game_type=game_type.value)

    # add arms
    for i, arm in enumerate(arms):
        Arm(game=game_obj, index=i,
            mean=arm['mean'], variance=arm['stdDev']**2)

    db.session.add(game_obj)
    db.session.commit()

    # create system object
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
        'gameId': game_obj.id,
        'game': game,
        'recommend': recommend
    })


def record():
    """
    Record user move
    """
    req = request.get_json()

    game_id = req['gameId']
    game_type = SystemTypes(req['gameType'])

    last_recommend = req['lastRecommend'] if game_type != SystemTypes.BASE else None

    game = req['game']
    arm_id = req['armId']
    decision = req['decision']
    reward = req['reward'] if decision == 1 else None

    # record in database
    game_obj = Game.query.filter_by(id=game_id).first()
    if not game_obj:
        raise Exception("Game not found")

    arm_choice = arm_id if decision == 1 else None
    game_round = GameRound(game=game_obj,
                           arm_choice=arm_choice,
                           recommendation=last_recommend,
                           observed_reward=reward,
                           round_number=len(game_obj.rounds))
    db.session.add(game_round)
    db.session.commit()

    # get next recommendation
    recommend = None
    if game_type == SystemTypes.OBSERVE:
        system = ObserveSystem.deserialize(game)
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
    req = request.get_json()

    game_id = req['gameId']
    final_score = req['finalScore']
    best_arm_guess = req['bestArmGuess']

    # record in database
    game_obj = Game.query.filter_by(id=game_id).first()
    if not game_obj:
        raise Exception("Game not found")

    game_obj.final_score = final_score
    game_obj.best_arm_guess = best_arm_guess
    db.session.commit()

    return jsonify({})


def leaderboard():
    """
    Return existing top scores
    """
    req = request.get_json()
    game_type = SystemTypes(req['gameType'])

    scores = [
        {'userId': game.user.id,
         'gameId': game.id,
         'score': game.final_score,
         } for game in
        Game.query.filter_by(game_type=game_type.value).order_by(
            Game.final_score.desc()).limit(10)
    ]

    return jsonify({
        "scores": scores
    })


def download():
    """
    Download logged data

    Format is described below

    games: [
        profile {
            id: string
        }

        game {
            startTime: timestamp in milliseconds
            gameId: string
            type: type of game
            finalScore: number
            arms: [
                u: mean of arm
                sd: std dev of arm
            ]
        }

        history: [
            time: timestamp in milliseconds
            recommendation: int or null
            action: int or null (if not base game, null means arm was rejected)
            reward: number or null (if user rejects recommendation)
        ]
    ]
    """

    games = []

    for gameDb in Game.query.all():
        profile_data = {
            'id': gameDb.user.id
        }

        game_data = {
            'startTime': gameDb.created_at.timestamp() * 1000,  # ms since epoch
            'gameId': gameDb.id,
            'type': gameDb.game_type,
            'finalScore': gameDb.final_score,
            'arms': [{
                'u': arm.mean,
                'sd': arm.variance ** .5
            } for arm in gameDb.arms]
        }

        history_data = [
            {
                'time': round.created_at.timestamp() * 1000,
                'recommendation': round.recommendation,
                'action': round.arm_choice,
                'reward': round.observed_reward,
                'round': round.round_number
            } for round in gameDb.rounds
        ]

        games.append({
            'profile': profile_data,
            'game': game_data,
            'history': history_data
        })

    return jsonify(games)
