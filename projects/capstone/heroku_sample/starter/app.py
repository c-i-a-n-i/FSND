from flask import Flask, request, abort, jsonify
from flask_cors import CORS
from auth import requires_auth
from models import setup_db, Actor, Movie, Actor_Movie
from werkzeug.exceptions import HTTPException

RESULTS_PER_PAGE = 10


def paginate_results(request, selection):
    page = request.args.get("page", 1, type=int)
    start = (page - 1) * RESULTS_PER_PAGE
    end = start + RESULTS_PER_PAGE

    results = [result.format() for result in selection]
    current_results = results[start:end]

    return current_results


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    setup_db(app)
    CORS(app)

    # CORS Headers
    @app.after_request
    def after_request(response):
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization,true"
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
        )
        return response

    # Get movies GET /movies/?genre=${genre}
    @app.route("/movies")
    def retrieve_movies():
        genre = request.args.get("genre", "", type=str)
        search = request.args.get("searchTerm", "", type=str)

        if genre:
            selection = Movie.query.order_by(Movie.id).filter(
                Movie.genre.ilike("%{}%".format(genre))
            )
        elif search:
            selection = Movie.query.order_by(Movie.id).filter(
                Movie.title.ilike("%{}%".format(search))
            )
        else:
            selection = Movie.query.order_by(Movie.id).all()
        current_movies = paginate_results(request, selection)
        if len(current_movies) == 0:
            abort(404)

        return jsonify(
            {
                "success": True,
                "movies": current_movies,
                "total_movies": len(Movie.query.all()),
            }
        )

    # Get a movie: GET /movies/${id}
    @app.route("/movies/<int:movie_id>")
    @requires_auth('get:movies')
    def get_movie(movie_id):
        try:
            selection = Actor_Movie.query.filter(
                Actor_Movie.movie_id == movie_id)
            movie = Movie.query.filter(
                Movie.id == movie_id).one_or_none()

            actors = [e.actors.format() for e in selection]

            if movie is None:
                abort(404)

            return jsonify(
                {
                    "success": True,
                    "movie": movie.format(),
                    "actors": actors,
                }
            )

        except Exception as e:
            if isinstance(e, HTTPException):
                abort(e.code)
            else:
                abort(422)

    # Add a movie

    @app.route("/movies", methods=["POST"])
    @requires_auth('post:movies')
    def create_movie():
        body = request.get_json()

        new_title = body.get("title", None)
        new_overview = body.get("overview", None)
        new_genre = body.get("genre", None)
        new_release_date = body.get("release_date", None)
        new_first_air_date = body.get("first_air_date", None)
        new_rating = body.get("rating", None)
        new_backdrop_path = body.get("backdrop_path", None)
        new_poster_path = body.get("poster_path", None)
        actors = body.get("actors", [])
        selectedActors = [a["id"] for a in actors if a["selected"]]

        try:
            if(not(new_title and new_overview and new_genre and new_release_date and new_first_air_date)):
                abort(400)
            movie = Movie(new_title, new_backdrop_path, new_poster_path, new_overview,
                          new_genre, new_release_date, new_first_air_date, new_rating)
            movie.insert()

            # Insert all new actors under the movie
            for x in selectedActors:
                m = Actor_Movie(movie.id, x)
                m.insert()

            selection = Movie.query.order_by(Movie.id).all()
            current_movies = paginate_results(request, selection)

            return jsonify(
                {
                    "success": True,
                    "created": movie.id,
                    "movies": current_movies,
                    "total_movies": len(Movie.query.all()),
                }
            )

        except Exception as e:
            if isinstance(e, HTTPException):
                abort(e.code)
            else:
                abort(422)

    # Delete a movie: DELETE /movies/${id}
    @app.route("/movies/<int:movie_id>", methods=["DELETE"])
    @requires_auth('delete:movies')
    def delete_movie(movie_id):
        try:
            movie = Movie.query.filter(
                Movie.id == movie_id).one_or_none()

            if movie is None:
                abort(404)

            movie.delete()
            selection = Movie.query.order_by(Movie.id).all()
            current_movies = paginate_results(request, selection)

            return jsonify(
                {
                    "success": True,
                    "deleted": movie_id,
                    "movies": current_movies,
                    "total_movies": len(Movie.query.all()),
                }
            )

        except Exception as e:
            if isinstance(e, HTTPException):
                abort(e.code)
            else:
                abort(422)

    # Get actors
    @app.route("/actors")
    def retrieve_actors():
        search = request.args.get("searchTerm", "", type=str)

        if search:
            selection = Actor.query.order_by(Actor.name).filter(
                Actor.name.ilike("%{}%".format(search))
            )
        else:
            selection = Actor.query.order_by(Actor.name).all()
        current_actors = paginate_results(request, selection)
        if len(current_actors) == 0:
            abort(404)

        return jsonify(
            {
                "success": True,
                "actors": current_actors,
                "total_actors": len(Movie.query.all()),
            }
        )

    # Get an actor: GET /actors/${id}
    @app.route("/actors/<int:actor_id>")
    @requires_auth('get:actors')
    def get_actor(actor_id):
        try:
            selection = Actor_Movie.query.filter(
                Actor_Movie.actor_id == actor_id)
            actor = Actor.query.filter(
                Actor.id == actor_id).one_or_none()

            movies = [e.movies.format() for e in selection]

            if actor is None:
                abort(404)

            return jsonify(
                {
                    "success": True,
                    "actor": actor.format(),
                    "movies": movies,
                }
            )

        except Exception as e:
            if isinstance(e, HTTPException):
                abort(e.code)
            else:
                abort(422)

    # Add an actor

    @app.route("/actors", methods=["POST"])
    @requires_auth('post:actors')
    def create_actor():
        body = request.get_json()

        new_name = body.get("name", None)
        new_dob = body.get("dob", None)
        new_gender = body.get("gender", None)
        new_picture_path = body.get("picture_path", None)
        new_description = body.get("description", None)
        movies = body.get("movies", [])
        selectedMovies = [m["id"] for m in movies if m["selected"]]

        try:
            if(not(new_name and new_dob and new_gender and new_picture_path and new_description)):
                abort(400)
            actor = Actor(new_name, new_dob, new_gender,
                          new_picture_path, new_description)
            actor.insert()

            # Insert all new movies under the actor
            for x in selectedMovies:
                a = Actor_Movie(x, actor.id)
                a.insert()

            selection = Actor.query.order_by(Actor.name).all()
            current_actors = paginate_results(request, selection)

            return jsonify(
                {
                    "success": True,
                    "created": actor.id,
                    "actors": current_actors,
                    "total_actors": len(Actor.query.all()),
                }
            )

        except Exception as e:
            if isinstance(e, HTTPException):
                abort(e.code)
            else:
                abort(422)

    # Delete a actor: DELETE /actors/${id}
    @app.route("/actors/<int:actor_id>", methods=["DELETE"])
    @requires_auth('delete:actors')
    def delete_actor(actor_id):
        try:
            actor = Actor.query.filter(
                Actor.id == actor_id).one_or_none()

            if actor is None:
                abort(404)

            actor.delete()
            selection = Actor.query.order_by(Actor.name).all()
            current_actors = paginate_results(request, selection)

            return jsonify(
                {
                    "success": True,
                    "deleted": actor_id,
                    "actors": current_actors,
                    "total_actors": len(Actor.query.all()),
                }
            )

        except Exception as e:
            if isinstance(e, HTTPException):
                abort(e.code)
            else:
                abort(422)

    # Update an actor: PATCH /actors/${id}/edit
    @app.route("/actors/<int:actor_id>/edit", methods=["PATCH"])
    @requires_auth('patch:actors')
    def edit_actor(actor_id):
        body = request.get_json()

        new_name = body.get("name", None)
        new_dob = body.get("dob", None)
        new_gender = body.get("gender", None)
        new_picture_path = body.get("picture_path", None)
        new_description = body.get("description", None)
        movies = body.get("movies", [])
        selectedMovies = [m["id"] for m in movies if m["selected"]]

        try:
            # First delete all existing movies under that actor
            selection = Actor_Movie.query.filter(
                Actor_Movie.actor_id == actor_id)
            for x in selection:
                x.delete()

            # Then insert all new movies under the actor
            for x in selectedMovies:
                actor = Actor_Movie(x, actor_id)
                actor.insert()

            # Then update the remaining properties of the actor
            actor = Actor.query.filter(
                Actor.id == actor_id).one_or_none()

            if actor is None:
                abort(404)
            actor.name = new_name
            actor.dob = new_dob
            actor.gender = new_gender
            actor.picture_path = new_picture_path
            actor.description = new_description
            actor.update()
            selection = Actor.query.order_by(Actor.name).all()
            current_actors = paginate_results(request, selection)

            return jsonify(
                {
                    "success": True,
                    "edited": actor_id,
                    "actors": current_actors,
                    "total_actors": len(Actor.query.all()),
                }
            )

        except Exception as e:
            if isinstance(e, HTTPException):
                abort(e.code)
            else:
                abort(422)

    # Update a movie: PATCH /movies/${id}/edit
    @app.route("/movies/<int:movie_id>/edit", methods=["PATCH"])
    @requires_auth('patch:movies')
    def edit_movie(movie_id):
        body = request.get_json()

        new_title = body.get("title", None)
        new_overview = body.get("overview", None)
        new_genre = body.get("genre", None)
        new_release_date = body.get("release_date", None)
        new_first_air_date = body.get("first_air_date", None)
        new_rating = body.get("rating", None)
        new_backdrop_path = body.get("backdrop_path", None)
        new_poster_path = body.get("poster_path", None)
        actors = body.get("actors", [])
        selectedActors = [a["id"] for a in actors if a["selected"]]

        try:
            # First delete all existing actors under that movie
            selection = Actor_Movie.query.filter(
                Actor_Movie.movie_id == movie_id)
            for x in selection:
                x.delete()

            # Then insert all new actors under the movie
            for x in selectedActors:
                movie = Actor_Movie(movie_id, x)
                movie.insert()

            # Then update the remaining properties of the movie
            movie = Movie.query.filter(
                Movie.id == movie_id).one_or_none()

            if movie is None:
                abort(404)
            movie.title = new_title
            movie.overview = new_overview
            movie.genre = new_genre
            movie.release_date = new_release_date
            movie.first_air_date = new_first_air_date
            movie.rating = new_rating
            movie.backdrop_path = new_backdrop_path
            movie.poster_path = new_poster_path

            movie.update()
            selection = Movie.query.order_by(Movie.title).all()
            current_movies = paginate_results(request, selection)

            return jsonify(
                {
                    "success": True,
                    "edited": movie_id,
                    "movies": current_movies,
                    "total_movies": len(Movie.query.all()),
                }
            )

        except Exception as e:
            if isinstance(e, HTTPException):
                abort(e.code)
            else:
                abort(422)

    @app.route("/")
    def default():
        return "Working"

    @app.errorhandler(404)
    def not_found(error):
        return (
            jsonify({"success": False, "error": 404,
                    "message": "resource not found"}),
            404,
        )

    @app.errorhandler(422)
    def unprocessable(error):
        return (
            jsonify({"success": False, "error": 422,
                    "message": "unprocessable"}),
            422,
        )

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"success": False, "error": 400, "message": "bad request"}), 400

    @app.errorhandler(405)
    def not_found(error):
        return (
            jsonify({"success": False, "error": 405,
                    "message": "method not allowed"}),
            405,
        )

    return app


app = create_app()

if __name__ == '__main__':
    app.run()
