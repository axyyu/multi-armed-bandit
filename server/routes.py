from flask import Blueprint

from .controller import home, leaderboard, recommend, score, start, record

routes = Blueprint("/", __name__)

routes.route("/", methods=["GET"])(home)

routes.route("/api/start", methods=["POST"])(start)
routes.route("/api/recommend", methods=["POST"])(recommend)
routes.route("/api/record", methods=["POST"])(record)

routes.route("/api/leaderboard", methods=["GET"])(leaderboard)
routes.route("/api/score", methods=["POST"])(score)
