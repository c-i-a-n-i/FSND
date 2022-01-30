import React, { useState, useContext } from 'react';
import { useRouter } from "next/router";
import { AppContext } from './_app';

function MovieForm() {
    const {appContext} = useContext(AppContext)
    const BASE_URL = appContext.apiUrl

    const [values, setValues] = useState({
        title: "",
        overview: "",
        genre: "",
        release_date: "",
        first_air_date: "",
        rating: 0,
        backdrop_path: "",
        poster_path: "",
      })
    const router = useRouter();

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${appContext.accessToken}`
    });
    const options = {
        method: 'POST',
        body: JSON.stringify(values),
        headers
    };

    const onSubmit = async e => {
        e.preventDefault();
        const request = await fetch(
            `${BASE_URL}/movies`, options
          ).then((res) => res.json());

        if(request.success){
            alert("Successfully added the movie")
        }else{
            alert("Failed to add the movie")
        }

        router.push('/')
    }
    
    const handleChange = event =>{
        setValues({...values, [event.target.id]: event.target.value})
    }
  return <div className="p-10 w-1/2">
            <h1 className="text-5xl font-medium leading-tight mt-0 mb-2 text-600">Add movie</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group mb-6">
                <label className="text-2xl font-medium leading-tight mt-0 mb-2 text-600">Title</label>
                <input type="text" className="form-control block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="title"
                    placeholder="Title" onChange={handleChange}/>
                </div>
                <div className="form-group mb-6">
                <label className="text-2xl font-medium leading-tight mt-0 mb-2 text-600">Overview</label>
                <textarea
                className="
                    form-control
                    block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                "
                id="overview"
                rows="3"
                placeholder="Overview"
                onChange={handleChange}
                ></textarea>
                </div>
                <div className="form-group mb-6">
                <label className="text-2xl font-medium leading-tight mt-0 mb-2 text-600">Rating</label>
                <input type="number" className="form-control block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="rating"
                    placeholder="Rating (1-10)" min="1" max="10" onChange={handleChange}/>
                </div>
                <div className="form-group mb-6">
                <label className="text-2xl font-medium leading-tight mt-0 mb-2 text-600">Release Date</label>
                <input type="date" className="form-control block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="release_date"
                    onChange={handleChange}/>
                </div>
                <div className="form-group mb-6">
                <label className="text-2xl font-medium leading-tight mt-0 mb-2 text-600">First Air Date</label>
                <input type="date" className="form-control block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="first_air_date"
                    onChange={handleChange}/>
                </div>
                <div className="form-group mb-6">
                <label className="text-2xl font-medium leading-tight mt-0 mb-2 text-600">Genre</label>
                <input type="text" className="form-control block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="genre"
                    placeholder="Genres comma separated e.g. Drama, Action, Fantasy" onChange={handleChange}/>
                </div>
                <div className="form-group mb-6">
                <label className="text-2xl font-medium leading-tight mt-0 mb-2 text-600">Backdrop path</label>
                <input type="url" className="form-control block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="backdrop_path"
                    placeholder="Backdrop path" onChange={handleChange}/>
                </div>
                <div className="form-group mb-6">
                <label className="text-2xl font-medium leading-tight mt-0 mb-2 text-600">Poster path</label>
                <input type="url" className="form-control block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="poster_path"
                    placeholder="Poster path" onChange={handleChange}/>
                </div>
                <button type="submit" className="
                w-full
                px-6
                py-2.5
                bg-blue-600
                text-white
                font-medium
                text-xs
                leading-tight
                uppercase
                rounded
                shadow-md
                hover:bg-blue-700 hover:shadow-lg
                focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                active:bg-blue-800 active:shadow-lg
                transition
                duration-150
                ease-in-out">Add</button>
            </form>
        </div>;
}

export default MovieForm;
