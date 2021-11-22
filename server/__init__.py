import os

import numpy as np
from dotenv import load_dotenv
from flask import Flask, g
from flask.json import JSONEncoder
from flask_cors import CORS
from flask_migrate import Migrate

from .db import db
from .models import *  # needed for migrations
from .routes import routes

load_dotenv()

USE_PROXY = os.environ.get('USE_PROXY')
FLASK_ENV = os.environ.get('FLASK_ENV')

# Database Configuration Variables
DB_USER = 'admin'
DB_PASS = 'multi-armed-bandit-uva-hongning'
DB_NAME = 'mab'
DB_SOCKET_DIR = '/cloudsql'
CLOUD_SQL_CONNECTION_NAME = 'modern-tangent-218303:us-east4:multi-armed-bandit'


def create_app():
    app = Flask(__name__, instance_relative_config=True,
                static_url_path='', static_folder='../website/build')

    if(USE_PROXY):
        database_uri = f"mysql+pymysql://{DB_USER}:{DB_PASS}@localhost:3306/{DB_NAME}"
    elif(FLASK_ENV == "development"):
        database_uri = "sqlite:///{}".format(
            os.path.join(app.instance_path, 'app.sqlite'))
    else:
        database_uri = f"mysql+pymysql://{DB_USER}:{DB_PASS}@/{DB_NAME}?unix_socket={DB_SOCKET_DIR}/{CLOUD_SQL_CONNECTION_NAME}"

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
    Migrate(app, db)
    app.register_blueprint(routes)

    return app
