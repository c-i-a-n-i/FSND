import React, { useContext, useState } from 'react';
import { useRouter } from "next/router";
import { MovieFormContext } from './_app';
import { AppContext } from './_app';

function MovieForm() {
    const {movieForm} = useContext(MovieFormContext)
    const {appContext} = useContext(AppContext)
    const BASE_URL = appContext.apiUrl

    const [values, setValues] = useState(movieForm)
    const canDelete = appContext.permissions.includes("delete:movies")
    const canUpdate = appContext.permissions.includes("patch:movies")

    const router = useRouter();

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${appContext.accessToken}`
    });
    const udpateOptions = {
        method: 'PATCH',
        body: JSON.stringify(values),
        headers
    };
    const deleteOptions = {
        method: 'DELETE',
        headers
    }
    
    const onSubmit = async e => {
        e.preventDefault();
        const request = await fetch(
            `${BASE_URL}/movies/${values.id}/edit`, udpateOptions
          ).then((res) => res.json());

        if(request.success){
            alert("Successfully updated the movie")
        }else{
            alert("Failed to update the movie")
        }

        router.push('/')
    }

    const deleteMovie = async e => {
        e.preventDefault();
        const request = await fetch(
            `${BASE_URL}/movies/${values.id}`, deleteOptions
          ).then((res) => res.json());

        if(request.success){
            alert("Successfully deleted the movie")
        }else{
            alert("Failed to delete the movie")
        }

        router.push('/')
    }
    
    const handleChange = event =>{
        setValues({...values, [event.target.id]: event.target.value})
    }

    const handleCastingChange = event =>{
        const actors = values.actors.map(m => {
            const actor = {...m}
            if(actor.id == event.target.id){
                actor.selected = event.target.checked
            }
            return actor
        })
        setValues({...values, actors})
    }

    return <div className="p-10 w-1/2">
                <h1 className="text-5xl font-medium leading-tight mt-0 mb-2 text-600">Edit movie</h1>
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
                        placeholder="Title" onChange={handleChange} value={values.title}/>
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
                    onChange={handleChange} value={values.overview}
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
                        placeholder="Rating (1-10)" min="1" max="10" onChange={handleChange} value={values.rating}/>
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
                        onChange={handleChange} value={new Date(values.release_date).toISOString().substring(0,10)}/>
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
                        onChange={handleChange} value={new Date(values.first_air_date).toISOString().substring(0,10)}/>
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
                        placeholder="Slash separated genres e.g. Drama / Action / Fantasy" onChange={handleChange} value={values.genre}/> 
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
                        placeholder="Backdrop path" onChange={handleChange} value={values.backdrop_path}/>
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
                        placeholder="Poster path" onChange={handleChange} value={values.poster_path}/>
                    </div>
                    <label className="text-2xl font-medium leading-tight mt-0 mb-2 text-600">Cast</label>
                    {
                        values.actors.map(actor => (
                            <div key={actor.id} className='p-4'>
                                <input type="checkbox" onClick={handleCastingChange} id={actor.id} checked={actor.selected}/>
                                <h6 className="text-base font-medium leading-tight mt-0 mb-2 text-600 inline">{actor.name}</h6>
                            </div>
                        ))
                    }
                    {
                    canUpdate && <button type="submit" className="
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
                    ease-in-out">Update</button>
                }
                {
                    canDelete && <button onClick={deleteMovie}className="
                    w-full
                    mt-8
                    px-6
                    py-2.5
                    bg-red-600
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
                    ease-in-out">Delete</button>
                }
                </form>
            </div>;
}

export default MovieForm;
