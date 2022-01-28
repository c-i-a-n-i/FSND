import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from app import create_app
from models import setup_db, Actor, Movie


class MovieTestCase(unittest.TestCase):
    """This class represents the movie test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.app = create_app()
        self.client = self.app.test_client
        self.database_name = "movie_site_test"
        self.database_path = "postgresql://{}:{}@{}/{}".format(
            "student", "student", "localhost:5432", self.database_name
        )
        self.new_actor = {
            "name": "Yanni Molowski",
            "dob": "1977-04-04",
            "gender": "Male",
            "picture_path": "https://media.istockphoto.com/photos/hes-a-handsome-man-picture-id180841365?k=20&m=180841365&s=170667a&w=0&h=AsrKSMjW_WqzRaz9Q3D95lfCchxXn6GgWDojXCwRr7c=",
            "description": "Some cool guy with a pretty face"
        }
        self.new_movie = {
            "title": "Spider-man 2",
            "overview": "Peter Parker is an unhappy man: after two years of fighting crime as Spider-Man, his life has begun to fall apart. The girl he loves is engaged to someone else, his grades are slipping, he cannot keep any of his jobs, and on top of it, the newspaper Daily Bugle is attacking him viciously, claiming that Spider-Man is a criminal. He reaches the breaking point and gives up the crime fighter's life, once and for all. But after a failed fusion experiment, eccentric and obsessive scientist Dr. Otto Octavius is transformed into super villain Doctor Octopus, Doc Ock for short, having four long tentacles as extra hands. Peter guesses it might just be time for Spider-Man to return, but would he act upon it?",
            "genre": "Action / Adventure / Fantasy / Romance / Sci-Fi",
            "release_date": "2004-04-05",
            "first_air_date": "2004-04-07",
            "rating": "7",
            "backdrop_path": "https://img.yts.mx/assets/images/movies/Spider_Man_2_2004/medium-cover.jpg",
            "poster_path": "https://img.yts.mx/assets/images/movies/Spider_Man_2_2004/medium-cover.jpg"
        }
        setup_db(self.app, self.database_path)

        # binds the app to the current context
        with self.app.app_context():
            self.db = SQLAlchemy()
            self.db.init_app(self.app)
            # create all tables
            self.db.create_all()

    def tearDown(self):
        """Executed after reach test"""
        pass

    def test_get_paginated_actors(self):
        res = self.client().get("/actors")
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["total_actors"])
        self.assertTrue(len(data["actors"]))

    def test_get_movies(self):
        res = self.client().get("/movies")
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["total_movies"])
        self.assertTrue(len(data["movies"]))

    def test_create_new_movie(self):
        res = self.client().post("/movies", json=self.new_movie)
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["created"])
        self.assertTrue(len(data["movies"]))
        self.assertTrue(data["total_movies"])

    def test_create_new_actor(self):
        res = self.client().post("/actors", json=self.new_actor)
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["created"])
        self.assertTrue(len(data["actors"]))
        self.assertTrue(data["total_actors"])

    def test_update_movie(self):
        res = self.client().patch("/movies/2/edit", json=self.new_movie)
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["updated"])
        self.assertTrue(len(data["movies"]))
        self.assertTrue(data["total_movies"])

    def test_update_actor(self):
        res = self.client().patch("/actors/2/edit", json=self.new_actor)
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["updated"])
        self.assertTrue(len(data["actors"]))
        self.assertTrue(data["total_actors"])

    def test_search_movie(self):
        res = self.client().post("/movies", json={"searchTerm": "pirates"})
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(len(data["movies"]))
        self.assertTrue(data["total_movies"])

    def test_search_actor(self):
        res = self.client().post("/actors", json={"searchTerm": "depp"})
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(len(data["actors"]))
        self.assertTrue(data["total_actors"])

    def test_delete_movie(self):
        res = self.client().delete("/movies/3")
        data = json.loads(res.data)

        movie = Movie.query.filter(Movie.id == 3).one_or_none()

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertEqual(data["deleted"], 3)
        self.assertTrue(data["total_movies"])
        self.assertTrue(len(data["movies"]))
        self.assertEqual(movie, None)

    def test_delete_actor(self):
        res = self.client().delete("/actors/3")
        data = json.loads(res.data)

        actor = Actor.query.filter(Actor.id == 3).one_or_none()

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertEqual(data["deleted"], 3)
        self.assertTrue(data["total_actors"])
        self.assertTrue(len(data["actors"]))
        self.assertEqual(actor, None)

    def test_404_requesting_results_beyond_valid_page(self):
        res = self.client().get("/actors?page=1000")
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], "resource not found")

    def test_400_create_new_movie(self):
        res = self.client().post(
            "/movies", json={"title": "GOAT men"})
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 400)
        self.assertEqual(data["success"], False)
        self.assertTrue(data["message"], "bad request")

    def test_405_if_movie_creation_not_allowed(self):
        res = self.client().post("/movies/45", json=self.new_movie)
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 405)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], "method not allowed")

    def test_404_if_movie_does_not_exist(self):
        res = self.client().delete("/movies/1000")
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], "resource not found")

    def test_400_create_new_actor(self):
        res = self.client().post(
            "/actors", json={"name": "Leo Messi"})
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 400)
        self.assertEqual(data["success"], False)
        self.assertTrue(data["message"], "bad request")

    def test_405_if_actor_creation_not_allowed(self):
        res = self.client().post("/actors/30", json=self.new_actor)
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 405)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], "method not allowed")

    def test_404_if_actor_does_not_exist(self):
        res = self.client().delete("/actors/100")
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], "resource not found")


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
