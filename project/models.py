from . import db
from flask_login import UserMixin



def get_user(user_id):
    user = User.query.filter_by(id=user_id).first()
    return user

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy ._.
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))
