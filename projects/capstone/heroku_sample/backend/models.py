import os
from sqlalchemy import Column, String, Integer, DateTime
from flask_sqlalchemy import SQLAlchemy

database_path = os.environ['DATABASE_URL']
if database_path.startswith("postgres://"):
    database_path = database_path.replace("postgres://", "postgresql://", 1)

db = SQLAlchemy()

'''
setup_db(app)
    binds a flask application and a SQLAlchemy service
'''


def setup_db(app, database_path=database_path):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
    db.create_all()


class Movie(db.Model):
    __tablename__ = 'movies'

    id = Column(Integer, primary_key=True)
    title = Column(String(120), nullable=False)
    backdrop_path = Column(String)
    poster_path = Column(String)
    overview = Column(String, nullable=False)
    genre = Column(String, nullable=False)
    release_date = Column(DateTime, nullable=False)
    first_air_date = Column(DateTime, nullable=False)
    rating = Column(Integer)
    actors = db.relationship(
        'Actor_Movie', cascade="all,delete", backref='movies', lazy=True)

    def __init__(self, title, backdrop_path, poster_path, overview, genre, release_date, first_air_date, rating):
        self.title = title
        self.backdrop_path = backdrop_path
        self.poster_path = poster_path
        self.overview = overview
        self.genre = genre
        self.release_date = release_date
        self.first_air_date = first_air_date
        self.rating = rating

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):

        return {
            'id': self.id,
            'title': self.title,
            'backdrop_path': self.backdrop_path,
            'poster_path': self.poster_path,
            'overview': self.overview,
            'genre': self.genre,
            'release_date': self.release_date,
            'first_air_date': self.first_air_date,
            'rating': self.rating
        }


class Actor(db.Model):
    __tablename__ = 'actors'

    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    dob = Column(DateTime, nullable=False)
    gender = Column(String, nullable=False)
    picture_path = Column(String)
    description = Column(String, nullable=False)
    movies = db.relationship(
        'Actor_Movie', cascade="all,delete", backref='actors', lazy=True)

    def __init__(self, name, dob, gender, picture_path, description):
        self.name = name
        self.dob = dob
        self.gender = gender
        self.picture_path = picture_path
        self.description = description

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):

        return {
            'id': self.id,
            'name': self.name,
            'dob': self.dob,
            'gender': self.gender,
            'picture_path': self.picture_path,
            'description': self.description,
        }

# Whenever you add a movie and pick all it's actors, you will add to this table for as many times as there are actors
# Similarly when you add an actor and pick his movies, you will add to this table for as many times as there are movies


class Actor_Movie(db.Model):
    __tablename__ = 'actor_movie_assoc'

    id = Column(Integer, primary_key=True)
    movie_id = Column(Integer, db.ForeignKey(
        'movies.id'), nullable=False)
    actor_id = Column(Integer, db.ForeignKey(
        'actors.id'), nullable=False)

    def __init__(self, movie_id, actor_id):
        self.movie_id = movie_id
        self.actor_id = actor_id

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):

        return {
            'id': self.id,
            'movie_id': self.movie_id,
            'actor_id': self.actor_id,
        }
