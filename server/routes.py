from flask import Blueprint

from .controller import download, home, leaderboard, record, score, start

routes = Blueprint("/", __name__)

routes.route("/", methods=["GET"])(home)

routes.route("/api/start", methods=["POST"])(start)
routes.route("/api/record", methods=["POST"])(record)

routes.route("/api/leaderboard", methods=["POST"])(leaderboard)
routes.route("/api/score", methods=["POST"])(score)

routes.route("/34down56", methods=["GET"])(download)
