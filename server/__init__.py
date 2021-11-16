import os

from dotenv import load_dotenv
from flask import Flask, g
from flask.json import JSONEncoder
from flask_cors import CORS
import numpy as np

from .db import db
from .routes import routes

load_dotenv()

# db_user = os.environ["DB_USER"]
# db_pass = os.environ["DB_PASS"]
# db_name = os.environ["DB_NAME"]
# db_socket_dir = os.environ.get("DB_SOCKET_DIR", "/cloudsql")
# cloud_sql_connection_name = os.environ["CLOUD_SQL_CONNECTION_NAME"]


def create_app():
    app = Flask(__name__, instance_relative_config=True)

    database_uri = "sqlite:///{}".format(
        os.path.join(app.instance_path, 'app.sqlite'))

    # if(os.environ.get("FLASK_ENV") == "development"):
    #     database_uri = "sqlite:///{}".format(
    #         os.path.join(app.instance_path, 'app.sqlite'))
    # else:
    #     if(os.environ.get("USE_PROXY") == "true"):
    #         database_uri = f"mysql+pymysql://{db_user}:{db_pass}@localhost:3306/{db_name}"

    #     database_uri = f"mysql+pymysql://{db_user}:{db_pass}@/{db_name}?unix_socket={db_socket_dir}/{cloud_sql_connection_name}"

    app.config.from_mapping(
        SECRET_KEY='dev',
        SQLALCHEMY_DATABASE_URI=database_uri,
    )

    # setup json encoder
    class NumpyEncoder(JSONEncoder):
        def default(self, obj):
            if isinstance(obj, np.integer):
                return int(obj)
            if isinstance(obj, np.floating):
                return float(obj)
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            return JSONEncoder.default(self, obj)

    app.json_encoder = NumpyEncoder

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    db.init_app(app)
    CORS(app)
    app.register_blueprint(routes)

    return app
