from flask import Flask, request, jsonify, abort
import json
from flask_cors import CORS
from .database.models import db_drop_and_create_all, setup_db, Drink
from .auth.auth import requires_auth
from werkzeug.exceptions import HTTPException


DRINKS_PER_PAGE = 10

app = Flask(__name__)
setup_db(app)
CORS(app)

'''
Uncomment the following line to initialize the datbase
!! NOTE THIS WILL DROP ALL RECORDS AND START YOUR DB FROM SCRATCH
!! NOTE THIS MUST BE UNCOMMENTED ON FIRST RUN
!! Running this function will add one
'''
db_drop_and_create_all()

# CORS Headers


@app.after_request
def after_request(response):
    response.headers.add(
        "Access-Control-Allow-Headers", "Content-Type,Authorization"
    )
    response.headers.add(
        "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
    )
    return response


def paginate_drinks(request, selection, long = False):
    page = request.args.get("page", 1, type=int)
    start = (page - 1) * DRINKS_PER_PAGE
    end = start + DRINKS_PER_PAGE
    drinks = []
    if(long):
        drinks = [drink.long() for drink in selection]
    else:
        drinks = [drink.short() for drink in selection]

    current_drinks = drinks[start:end]

    return current_drinks


# Get drinks: GET/ drinks
@app.route("/drinks")
@requires_auth('get:drinks')
def retrieve_drinks():
    selection = Drink.query.order_by(Drink.id).all()
    current_drinks = paginate_drinks(request, selection)
    if len(current_drinks) == 0:
        abort(404)

    return jsonify(
        {
            "success": True,
            "drinks": current_drinks,
            "total_drinks": len(Drink.query.all()),
        }
    )


# Get drinks in detail: GET /drinks-detail
@app.route("/drinks-detail")
@requires_auth('get:drinks-detail')
def retrieve_drinks_detail():
    selection = Drink.query.order_by(Drink.id).all()
    current_drinks = paginate_drinks(request, selection, long=True)
    if len(current_drinks) == 0:
        abort(404)

    return jsonify(
        {
            "success": True,
            "drinks": current_drinks,
            "total_drinks": len(Drink.query.all()),
        }
    )


# Add a drink: POST /drinks
@app.route("/drinks", methods=["POST"])
@requires_auth('post:drinks')
def create_drink():
    body = request.get_json()

    title = body.get("title", None)
    recipe = json.dumps(body.get("recipe", None))

    try:
        if(not(recipe and title)):
            abort(400)
        drink = Drink(title=title, recipe=recipe)
        drink.insert()

        selection = Drink.query.order_by(Drink.id).all()
        current_drinks = paginate_drinks(request, selection, long=True)

        return jsonify(
            {
                "success": True,
                "created": drink.id,
                "drinks": current_drinks,
                "total_drinks": len(Drink.query.all()),
            }
        )

    except Exception as e:
        if isinstance(e, HTTPException):
            abort(e.code)
        else:
            abort(422)


# Modify a drink: PATCH /drinks/<id>
@app.route("/drinks/<int:drink_id>", methods=["PATCH"])
@requires_auth('patch:drinks')
def modify_drink(drink_id):
    body = request.get_json()

    title = body.get("title", None)
    recipe = json.dumps(body.get("recipe", None))

    try:
        drink = Drink.query.filter(
            Drink.id == drink_id).one_or_none()

        if drink is None:
            abort(404)

        if(not(recipe and title)):
            abort(400)
        drink.title = title
        drink.recipe = recipe
        drink.update()

        selection = Drink.query.order_by(Drink.id).all()
        current_drinks = paginate_drinks(request, selection, long=True)

        return jsonify(
            {
                "success": True,
                "created": drink.id,
                "drinks": current_drinks,
                "total_drinks": len(Drink.query.all()),
            }
        )

    except Exception as e:
        if isinstance(e, HTTPException):
            abort(e.code)
        else:
            abort(422)


# Delete a drink: DELETE /drinks/${id}
@app.route("/drinks/<int:drink_id>", methods=["DELETE"])
@requires_auth('delete:drinks')
def delete_drink(drink_id):
    try:
        drink = Drink.query.filter(
            Drink.id == drink_id).one_or_none()

        if drink is None:
            abort(404)

        drink.delete()
        selection = Drink.query.order_by(Drink.id).all()
        current_drinks = paginate_drinks(request, selection)

        return jsonify(
            {
                "success": True,
                "delete": drink_id,
                "drinks": current_drinks,
                "total_drinks": len(Drink.query.all()),
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

# Error Handling


@app.errorhandler(400)
def bad_request(error):
    return jsonify({"success": False, "error": 400, "message": "bad request"}), 400


@app.errorhandler(401)
def unauthorized(error):
    return (
        jsonify({"success": False, "error": 401,
                "message": "unauthorized"}),
        401,
    )

@app.errorhandler(403)
def uforbidden(error):
    return (
        jsonify({"success": False, "error": 403,
                "message": "forbidden"}),
        403,
    )


@app.errorhandler(404)
def not_found(error):
    return (
        jsonify({"success": False, "error": 404,
                "message": "resource not found"}),
        404,
    )


@app.errorhandler(405)
def not_found(error):
    return (
        jsonify({"success": False, "error": 405,
                "message": "method not allowed"}),
        405,
    )


@app.errorhandler(422)
def unprocessable(error):
    return (
        jsonify({"success": False, "error": 422,
                "message": "unprocessable"}),
        422,
    )

if __name__ == "__main__":
    app.debug = True
    app.run()
