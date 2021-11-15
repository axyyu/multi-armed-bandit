from flask import Blueprint

from .controller import home, leaderboard, recommend, score, start, record

routes = Blueprint("/", __name__)

routes.route("/", methods=["GET"])(home)

routes.route("/api/start", methods=["GET"])(start)
routes.route("/api/recommend", methods=["POST"])(recommend)
routes.route("/api/record", methods=["GET"])(record)

routes.route("/api/leaderboard", methods=["GET"])(leaderboard)
routes.route("/api/score", methods=["POST"])(score)
