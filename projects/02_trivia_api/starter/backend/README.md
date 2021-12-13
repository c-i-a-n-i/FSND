# Backend - Full Stack Trivia API 

## Installing Dependencies for the Backend

1. **Python 3.9** - Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)


2. **Virtual Enviornment** - We recommend working within a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organaized. Instructions for setting up a virual enviornment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)


3. **PIP Dependencies** - Once you have your virtual environment setup and running, install dependencies by naviging to the `/backend` directory and running:
```bash
pip install -r requirements.txt
```
This will install all of the required packages we selected within the `requirements.txt` file.


4. **Key Dependencies**
 - [Flask](http://flask.pocoo.org/)  is a lightweight backend microservices framework. Flask is required to handle requests and responses.

 - [SQLAlchemy](https://www.sqlalchemy.org/) is the Python SQL toolkit and ORM we'll use handle the lightweight sqlite database. You'll primarily work in app.py and can reference models.py. 

 - [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/#) is the extension we'll use to handle cross origin requests from our frontend server. 

## Database Setup
1. **Database setup** - With Postgres running, create the trivia and trivia_test databases using the setup.psql file provided. These would be our actual and test databases respectively. From the backend folder in terminal, in psql context, run:
```bash
\i setup.sql
```
2. **Populate tables** - Create and populate the questions and categories tables for both databases using the trivia.psql file provided. From the backend folder in termina, and logging into each database in psql, run:
```bash
psql trivia < trivia.psql
```
if that doesn't work, you might need to force it. Use: 
```bash
psql -d trivia -U postgres -a -f trivia.psql
```
At this point, you should have questions and categories tables populated with some data in each database 
## Running the server

From within the `./backend` directory first ensure you are working using your created virtual environment.

To run the server, execute:

```bash
export FLASK_APP=flaskr
export FLASK_ENV=development
flask run --reload
```
or for Windows users, execute:
```cmd
set FLASK_APP=flaskr
set FLASK_ENV=development
flask run --reload
```
The `--reload` flag will detect file changes and restart the server automatically.

## Common issues
1. If you encounter TypeError: can't apply this `__setattr__` to DefaultMeta object, 
you are probably using python version 3.8.4. Either downgrade to 3.8.3 or upgrade to 3.8.5 or higher: [github issue link](https://github.com/pallets/flask-sqlalchemy/issues/852)
2. flask run might not work in development environment. This is an issue with version 0.15.5 of Werkzeug. You should upgrade to 0.15.6 to fix it, or alternatively, try running this work around: 
```cmd
set FLASK_DEBUG=1 && python -m flask run
```
3. You can have some issue with `AttributeError: module 'time' has no attribute 'clock'`. Just replace time.clock with time.time in Lib\site-packages\sqlalchemy\util\compat.py

## Testing
To debug the endpoints, you can use the vscode debugger along with this configuration in the workspace launch.json:
```
{
  "configurations": [
    {
      "name": "Python: Flask",
      "type": "python",
      "request": "launch",
      "module": "flask",
      "console": "integratedTerminal",
      "justMyCode": false,
      "env": { "FLASK_APP": "backend/flaskr", 
                "FLASK_ENV": "development" 
            },
      "args": ["run", "--no-debugger"],
      "jinja": true
    }
  ]
}
```
To run the unit tests, in the `.\backend` folder, run the following:
```
dropdb trivia_test
createdb trivia_test
psql trivia_test < trivia.psql
python test_flaskr.py
```

## API reference
The following are the API endpoints included in this project, along with a brief description of what they do and their expected results. Pagination is supported for all endpoints with a page size of 10 items. All endpoints return a success property which is True if the api call was successful and False if something went wrong.

### Get questions 
_GET /questions_

Retrieves all questions in the database, sorted by question id and paginated. If no page query parameter is passed, the first page is returned.
- Request Arguments: page - integer(optional)
- Returns: An object with 10 paginated questions, total questions, object including all categories, and current category string


Example:

REQUEST
```bash
curl http://127.0.0.1:5000/questions?page=4
```

RESPONSE
```
{
    'questions': [
        {
            'id': 1,
            'question': 'This is a question',
            'answer': 'This is an answer', 
            'difficulty': 5,
            'category': 2
        },
    ],
    'total_questions': 31,
    'categories': { 
        '1' : "Science",
        '2' : "Art",
        '3' : "Geography",
        '4' : "History",
        '5' : "Entertainment",
        '6' : "Sports" 
    },
    'current_category': 'History',
    'success': True
}
```

### Get next question for quiz
_POST /quizzes_

Given a list of previously asked questions and an optional category, retrieves a new question in that category. If no new question exists for that category, returns an empty question. If no category is passed, the question returned is taken from any category.
- Request Body: previous_questions:  an array of question id's such as [1, 4, 20, 15]
                quiz_category: an object containing id and type of category.
'quiz_category': a string of the current category }
- Returns: a single new question object 

Example:

REQUEST
```bash
curl http://127.0.0.1:5000/quizzes -X POST 
-H "Content-Type: application/json" 
-d '{   "previous_questions": [20, 3, 4],
        "quiz_category": {"id":"1", "type": "Science"}
    }'
```

RESPONSE
```
{
    'question': {
        'id': 1,
        'question': 'This is a question',
        'answer': 'This is an answer', 
        'difficulty': 5,
        'category': 4
    },
    'success': True
}
```

### Get categories
_GET /categories_

Retrieves all categories in the database as a key value pair with the key being the category id and the value being the category type.

Example:

REQUEST
```bash
curl http://127.0.0.1:5000/categories 
```

RESPONSE
```
{
    "success": True,
    "categories": {
        '1' : "Science",
        '2' : "Art",
        '3' : "Geography",
        '4' : "History",
        '5' : "Entertainment",
        '6' : "Sports"
    }
}
```

### Get questions by category
_GET /categories/${id}/questions_

Retrieves all questions in a particular category specified by the id in the endpoint path.
- Request Arguments: id - integer
- Returns: An object with questions for the specified category, total questions, and current category string 

Example:

REQUEST
```bash
curl http://127.0.0.1:5000/categories/4/questions 
```

RESPONSE
```
{
    'questions': [
        {
            'id': 1,
            'question': 'This is a question',
            'answer': 'This is an answer', 
            'difficulty': 3,
            'category': 4
        },
        {
            'id': 4,
            'question': 'This is another question',
            'answer': 'This is another answer', 
            'difficulty': 4,
            'category': 4
        },
        {
            'id': 8,
            'question': 'This is yet another question',
            'answer': 'This is yet another answer', 
            'difficulty': 5,
            'category': 4
        }
    ],
    'total_questions': 100,
    'current_category': 'History',
    'success': True
}
```

### Create questions
_POST /questions_

Creates a new question and stores it in the database.
- Request Body: question - string, answer -string, difficulty -integer, category -integer
- Returns: The current questions to be shown on the page, the total number of questions and the question id of the newly created question

Example:

REQUEST
```bash
curl http://127.0.0.1:5000/questions -X POST 
-H "Content-Type: application/json" 
-d "{
    'question':  'Here's a new question string',
    'answer':  'Here's a new answer string',
    'difficulty': 1,
    'category': 3,
}"
```

RESPONSE
```
{
    'questions': [
        {
            'id': 1,
            'question': 'This is a question',
            'answer': 'This is an answer', 
            'difficulty': 3,
            'category': 4
        },
        {
            'id': 4,
            'question': 'This is another question',
            'answer': 'This is another answer', 
            'difficulty': 4,
            'category': 4
        },
        {
            'id': 8,
            'question': 'This is yet another question',
            'answer': 'This is yet another answer', 
            'difficulty': 5,
            'category': 4
        }
    ],
    'total_questions': 101,
    'created': '101',
    'success': True
}
```

### Search for questions
_POST /questions_

Retrieves questions that contain the search term
- Request Body: searchTerm - string
- Returns: An array of questions, a number of total_questions that met the search term and the current category string 

Example:

REQUEST
```bash
curl http://127.0.0.1:5000/questions -X POST 
-H "Content-Type: application/json" 
-d "{
    'searchTerm': 'this is the term the user is looking for'
}"
```

RESPONSE
```
{
    'questions': [
        {
            'id': 1,
            'question': 'This is a question that has this is the term the user is looking for',
            'answer': 'This is an answer', 
            'difficulty': 3,
            'category': 4
        },
        {
            'id': 4,
            'question': 'this is the term the user is looking for in another question',
            'answer': 'This is another answer', 
            'difficulty': 4,
            'category': 4
        }
    ],
    'total_questions': 100,
    'current_category': 'Entertainment'
    'success': True
}
```

### Delete questions
_DELETE /questions/${id}_

Deletes the question with the id in the path from the database.
- Request Arguments: id - integer
- Returns: The deleted question id, the questions for that page and the total number of questions in the database

Example:

REQUEST
```bash
curl http://127.0.0.1:5000/questions/2 -X DELETE 
```

RESPONSE
```
{
    'questions': [
        {
            'id': 1,
            'question': 'This is a question that has this is the term the user is looking for',
            'answer': 'This is an answer', 
            'difficulty': 3,
            'category': 4
        },
        {
            'id': 4,
            'question': 'this is the term the user is looking for in another question',
            'answer': 'This is another answer', 
            'difficulty': 4,
            'category': 4
        }
    ],
    'deleted': 2
    'total_questions': 99,
    'success': True
}
```

