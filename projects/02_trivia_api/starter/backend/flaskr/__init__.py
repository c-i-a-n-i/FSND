from flask import Flask, request, abort, jsonify
from flask_cors import CORS
from models import setup_db, Question, Category
from werkzeug.exceptions import HTTPException

QUESTIONS_PER_PAGE = 10


def paginate_questions(request, selection):
    page = request.args.get("page", 1, type=int)
    start = (page - 1) * QUESTIONS_PER_PAGE
    end = start + QUESTIONS_PER_PAGE

    questions = [question.format() for question in selection]
    current_questions = questions[start:end]

    return current_questions


def get_categories():
    categories = {}
    categories_list = Category.query.order_by(Category.id).all()
    for category in categories_list:
        categories[str(category.id)] = category.type
    return categories


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

    # Get questions
    @app.route("/questions")
    def retrieve_questions():
        selection = Question.query.order_by(Question.id).all()
        current_questions = paginate_questions(request, selection)
        if len(current_questions) == 0:
            abort(404)

        return jsonify(
            {
                "success": True,
                "questions": current_questions,
                "total_questions": len(Question.query.all()),
                "current_category": None,
                "categories": get_categories()
            }
        )

    # Get categories
    @app.route("/categories")
    def retrieve_categories():
        return jsonify({"success": True, "categories": get_categories()})

    # Get next question for quiz
    @app.route("/quizzes", methods=["POST"])
    def retrieve_next_question():
        try:
            body = request.get_json()

            asked_questions = body.get("previous_questions", [])
            quiz_category = body.get("quiz_category", None)

            category_questions = Question.query.order_by(Question.id).filter(
                Question.category == int(quiz_category["id"]))

            # if asked_questions are as much as category_questions, then there are no new questions
            if(len(asked_questions) == len(quiz_category)):
                return jsonify({"success": True, "question": {}})

            # return the first question that hasn't been asked
            for question in category_questions:
                if(question.id not in asked_questions):
                    return jsonify({"success": True, "question": question.format()})

        except:
            abort(400)

    # Get questions by category: GET /categories/${id}/questions
    @app.route("/categories/<int:category_id>/questions")
    def retrieve_questions_by_category(category_id):
        selection = Question.query.order_by(Question.id).filter(
            Question.category == category_id)
        current_questions = paginate_questions(request, selection)

        if len(current_questions) == 0:
            abort(404)

        return jsonify(
            {
                "success": True,
                "questions": current_questions,
                "total_questions": len(Question.query.all()),
                "current_category": None,
                "categories": get_categories()
            }
        )

    # Create or Search for questions
    @app.route("/questions", methods=["POST"])
    def create_question():
        body = request.get_json()

        new_question = body.get("question", None)
        new_answer = body.get("answer", None)
        new_difficulty = body.get("difficulty", None)
        new_category = body.get("category", None)
        search = body.get("searchTerm", None)

        try:
            if search:
                selection = Question.query.order_by(Question.id).filter(
                    Question.question.ilike("%{}%".format(search))
                )
                current_questions = paginate_questions(request, selection)

                return jsonify(
                    {
                        "success": True,
                        "questions": current_questions,
                        "total_questions": len(selection.all()),
                        "current_category": None
                    }
                )

            else:
                if(not(new_question and new_answer and new_difficulty and new_category)):
                    abort(400)
                question = Question(question=new_question, answer=new_answer,
                                    difficulty=new_difficulty, category=new_category)
                question.insert()

                selection = Question.query.order_by(Question.id).all()
                current_questions = paginate_questions(request, selection)

                return jsonify(
                    {
                        "success": True,
                        "created": question.id,
                        "questions": current_questions,
                        "total_questions": len(Question.query.all()),
                    }
                )

        except Exception as e:
            if isinstance(e, HTTPException):
                abort(e.code)
            else:
                abort(422)

    # Delete a question: DELETE /questions/${id}
    @app.route("/questions/<int:question_id>", methods=["DELETE"])
    def delete_question(question_id):
        try:
            question = Question.query.filter(
                Question.id == question_id).one_or_none()

            if question is None:
                abort(404)

            question.delete()
            selection = Question.query.order_by(Question.id).all()
            current_questions = paginate_questions(request, selection)

            return jsonify(
                {
                    "success": True,
                    "deleted": question_id,
                    "questions": current_questions,
                    "total_questions": len(Question.query.all()),
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
