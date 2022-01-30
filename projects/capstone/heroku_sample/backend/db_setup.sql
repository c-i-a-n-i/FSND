DROP DATABASE IF EXISTS movie_site;
DROP DATABASE IF EXISTS movie_site_test;
DROP USER IF EXISTS student;
CREATE DATABASE movie_site;
CREATE DATABASE movie_site_test;

-- connect to the movie_site database
\c movie_site

DROP TABLE IF EXISTS public.movies;
DROP TABLE IF EXISTS public.actors;
DROP TABLE IF EXISTS public.actor_movie_assoc;

CREATE TABLE public.movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    backdrop_path VARCHAR,
    poster_path VARCHAR,
    overview VARCHAR NOT NULL,
    genre VARCHAR NOT NULL,
    release_date DATE NOT NULL,
    first_air_date DATE NOT NULL,
    rating INTEGER
);

CREATE TABLE public.actors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR NOT NULL,
    picture_path VARCHAR,
    description VARCHAR NOT NULL
);

CREATE TABLE public.actor_movie_assoc (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER NOT NULL,
    actor_id INTEGER NOT NULL
);

INSERT INTO
    public.movies (title, backdrop_path, poster_path, overview, genre, release_date, first_air_date, rating)
VALUES
    ('Pirates of the Caribbean: Dead Men Tell No Tales', 
    'https://img.yts.mx/assets/images/movies/pirates_of_the_caribbean_dead_men_tell_no_tales_2017/medium-cover.jpg', 
    'https://img.yts.mx/assets/images/movies/pirates_of_the_caribbean_dead_men_tell_no_tales_2017/medium-cover.jpg',
    'Captain Jack Sparrow (Johnny Depp) finds the winds of ill-fortune blowing even more strongly when deadly ghost pirates led by his old nemesis, the terrifying Captain Salazar (Javier Bardem), escape from the Devil''s Triangle, determined to kill every pirate at sea...including him.',
    'Action / Adventure / Fantasy',
    '2017-12-31',
    '2017-12-31',
    4), 
    ('Dunkirk', 
    'https://img.yts.mx/assets/images/movies/dunkirk_2017/medium-cover.jpg', 
    'https://img.yts.mx/assets/images/movies/dunkirk_2017/medium-cover.jpg',
    'May/June 1940. Four hundred thousand British and French soldiers are hole up in the French port town of Dunkirk. The only way out is via sea, and the Germans have air superiority, bombing the British soldiers and ships without much opposition. The situation looks dire and, in desperation, Britain sends civilian boats in addition to its hard-pressed Navy to try to evacuate the beleaguered forces. This is that story, seen through the eyes of a soldier amongst those trapped forces, two Royal Air Force fighter pilots, and a group of civilians on their boat, part of the evacuation fleet.',
    'Action / Drama / History / Thriller / War',
    '2017-12-31',
    '2017-12-31',
    6),  
    ('Superman', 
    'https://img.yts.mx/assets/images/movies/Superman_1978/medium-cover.jpg', 
    'https://img.yts.mx/assets/images/movies/Superman_1978/medium-cover.jpg',
    'Just before the destruction of the planet Krypton, scientist Jor-El sends his infant son Kal-El on a spaceship to Earth. Raised by kindly farmers Jonathan and Martha Kent, young Clark discovers the source of his superhuman powers and moves to Metropolis to fight evil. As Superman, he battles the villainous Lex Luthor, while, as novice reporter Clark Kent, he attempts to woo co-worker Lois Lane',
    'Action / Adventure / Drama / Romance / Sci-Fi',
    '1978-02-01',
    '1978-12-31',
    5);

INSERT INTO
    public.actors ( name, dob, gender, picture_path, description)
VALUES
    ('Johnny Depp', 
    '1973-06-09', 
    'Male',
    'https://static.onecms.io/wp-content/uploads/sites/20/2021/08/16/johnny-depp-1.jpg',
    'John Christopher Depp II is an American actor, producer, and musician. He is the recipient of various accolades, including a Golden Globe Award and a Screen Actors Guild Award, in addition to nominations for three Academy Awards and two British Academy Film Awards'
    ), 
    ('Orlando Bloom', 
    '1977-01-13', 
    'Male',
    'https://www.hollywoodreporter.com/wp-content/uploads/2021/08/GettyImages-1170752056.jpg',
    'Orlando Jonathan Blanchard Copeland Bloom is an English actor. He made his breakthrough as the character Legolas in The Lord of the Rings film series, a role he reprised in The Hobbit film series.'
    ),  
    ('Helena Bonham Carter', 
    '1976-05-26', 
    'Female',
    'https://upload.wikimedia.org/wikipedia/commons/9/94/Helena_Bonham_Carter_%28Berlin_Film_Festival_2011%29_3_cropped_%28cropped%29.jpg',
    'Helena Bonham Carter CBE is an English actress. Known for her roles in independent films and blockbusters, especially period dramas, she is the recipient of various accolades, including a British Academy Award'
    );
    
INSERT INTO
    public.actor_movie_assoc(movie_id, actor_id)
VALUES
    (2, 1), 
    (2, 2),  
    (3, 1);

-- connect to the movie_site_test database
\c movie_site_test

DROP TABLE IF EXISTS public.movies;
DROP TABLE IF EXISTS public.actors;
DROP TABLE IF EXISTS public.actor_movie_assoc;

CREATE TABLE public.movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    backdrop_path VARCHAR,
    poster_path VARCHAR,
    overview VARCHAR NOT NULL,
    genre VARCHAR NOT NULL,
    release_date DATE NOT NULL,
    first_air_date DATE NOT NULL,
    rating INTEGER
);

CREATE TABLE public.actors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR NOT NULL,
    picture_path VARCHAR,
    description VARCHAR NOT NULL
);

CREATE TABLE public.actor_movie_assoc (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER NOT NULL,
    actor_id INTEGER NOT NULL
);

INSERT INTO
    public.movies (title, backdrop_path, poster_path, overview, genre, release_date, first_air_date, rating)
VALUES
    ('Pirates of the Caribbean: Dead Men Tell No Tales', 
    'https://img.yts.mx/assets/images/movies/pirates_of_the_caribbean_dead_men_tell_no_tales_2017/medium-cover.jpg', 
    'https://img.yts.mx/assets/images/movies/pirates_of_the_caribbean_dead_men_tell_no_tales_2017/medium-cover.jpg',
    'Captain Jack Sparrow (Johnny Depp) finds the winds of ill-fortune blowing even more strongly when deadly ghost pirates led by his old nemesis, the terrifying Captain Salazar (Javier Bardem), escape from the Devil''s Triangle, determined to kill every pirate at sea...including him.',
    'Action / Adventure / Fantasy',
    '2017-12-31',
    '2017-12-31',
    4), 
    ('Dunkirk', 
    'https://img.yts.mx/assets/images/movies/dunkirk_2017/medium-cover.jpg', 
    'https://img.yts.mx/assets/images/movies/dunkirk_2017/medium-cover.jpg',
    'May/June 1940. Four hundred thousand British and French soldiers are hole up in the French port town of Dunkirk. The only way out is via sea, and the Germans have air superiority, bombing the British soldiers and ships without much opposition. The situation looks dire and, in desperation, Britain sends civilian boats in addition to its hard-pressed Navy to try to evacuate the beleaguered forces. This is that story, seen through the eyes of a soldier amongst those trapped forces, two Royal Air Force fighter pilots, and a group of civilians on their boat, part of the evacuation fleet.',
    'Action / Drama / History / Thriller / War',
    '2017-12-31',
    '2017-12-31',
    6),  
    ('Superman', 
    'https://img.yts.mx/assets/images/movies/Superman_1978/medium-cover.jpg', 
    'https://img.yts.mx/assets/images/movies/Superman_1978/medium-cover.jpg',
    'Just before the destruction of the planet Krypton, scientist Jor-El sends his infant son Kal-El on a spaceship to Earth. Raised by kindly farmers Jonathan and Martha Kent, young Clark discovers the source of his superhuman powers and moves to Metropolis to fight evil. As Superman, he battles the villainous Lex Luthor, while, as novice reporter Clark Kent, he attempts to woo co-worker Lois Lane',
    'Action / Adventure / Drama / Romance / Sci-Fi',
    '1978-02-01',
    '1978-12-31',
    5);

INSERT INTO
    public.actors ( name, dob, gender, picture_path, description)
VALUES
    ('Johnny Depp', 
    '1973-06-09', 
    'Male',
    'https://static.onecms.io/wp-content/uploads/sites/20/2021/08/16/johnny-depp-1.jpg',
    'John Christopher Depp II is an American actor, producer, and musician. He is the recipient of various accolades, including a Golden Globe Award and a Screen Actors Guild Award, in addition to nominations for three Academy Awards and two British Academy Film Awards'
    ), 
    ('Orlando Bloom', 
    '1977-01-13', 
    'Male',
    'https://www.hollywoodreporter.com/wp-content/uploads/2021/08/GettyImages-1170752056.jpg',
    'Orlando Jonathan Blanchard Copeland Bloom is an English actor. He made his breakthrough as the character Legolas in The Lord of the Rings film series, a role he reprised in The Hobbit film series.'
    ),  
    ('Helena Bonham Carter', 
    '1976-05-26', 
    'Female',
    'https://upload.wikimedia.org/wikipedia/commons/9/94/Helena_Bonham_Carter_%28Berlin_Film_Festival_2011%29_3_cropped_%28cropped%29.jpg',
    'Helena Bonham Carter CBE is an English actress. Known for her roles in independent films and blockbusters, especially period dramas, she is the recipient of various accolades, including a British Academy Award'
    );
    
INSERT INTO
    public.actor_movie_assoc(movie_id, actor_id)
VALUES
    (2, 1), 
    (2, 2),  
    (3, 1);

CREATE USER student WITH ENCRYPTED PASSWORD 'student';
GRANT ALL PRIVILEGES ON DATABASE movie_site TO student;
GRANT ALL PRIVILEGES ON DATABASE movie_site_test TO student;
ALTER USER student CREATEDB;
ALTER USER student WITH SUPERUSER;