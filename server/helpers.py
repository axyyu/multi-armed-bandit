from .db import db
from .models import *


def get_user(user_id):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        user = User(id=user_id)
        db.session.add(user)
        db.session.commit()
    return user
