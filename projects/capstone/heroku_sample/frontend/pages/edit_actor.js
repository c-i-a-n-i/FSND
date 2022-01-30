import React, { useState, useContext } from 'react';
import { useRouter } from "next/router";
import { ActorFormContext } from './_app';
import { AppContext } from './_app';

function ActorForm() {
    const {appContext} = useContext(AppContext)
    const {actorForm} = useContext(ActorFormContext)

    const BASE_URL = appContext.apiUrl
    
    const [values, setValues] = useState(actorForm)
    const canDelete = appContext.permissions.includes("delete:actors")
    const canUpdate = appContext.permissions.includes("patch:actors")

    const router = useRouter();

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${appContext.accessToken}`
    });
    const updateOptions = {
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
            `${BASE_URL}/actors/${values.id}/edit`, updateOptions
          ).then((res) => res.json());

        if(request.success){
            alert("Successfully updated the actor")
        }else{
            alert("Failed to update the actor")
        }

        router.push('/actors')
    }
    
    const deleteActor = async e => {
        e.preventDefault();
        const request = await fetch(
            `${BASE_URL}/actors/${values.id}`, deleteOptions
          ).then((res) => res.json());

        if(request.success){
            alert("Successfully deleted the actor")
        }else{
            alert("Failed to delete the actor")
        }

        router.push('/actors')
    }

    const handleChange = event =>{
        setValues({...values, [event.target.id]: event.target.value})
    }

    const handleCastingChange = event =>{
        const movies = values.movies.map(m => {
            const movie = {...m}
            if(movie.id == event.target.id){
                movie.selected = event.target.checked
            }
            return movie
        })
        setValues({...values, movies})
    }
  return <div className="p-10 w-1/2">
            <h1 className="text-5xl font-medium leading-tight mt-0 mb-2 text-600">Edit actor</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group mb-6">
                <label className="text-2xl font-medium leading-tight mt-0 mb-2 text-600">Name</label>
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
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="name"
                    placeholder="Name" onChange={handleChange} value={values.name}/>
                </div>
                <div className="form-group mb-6">
                <label className="text-2xl font-medium leading-tight mt-0 mb-2 text-600">Date of Birth</label>
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
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="dob"
                    onChange={handleChange} value={new Date(values.dob).toISOString().substring(0,10)}/>
                </div>
                <div className="form-group mb-6">
                <label className="text-2xl font-medium leading-tight mt-0 mb-2 text-600">Gender</label>
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
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="gender"
                    placeholder="Gender" onChange={handleChange} value={values.gender}/>
                </div>
                <div className="form-group mb-6">
                <label className="text-2xl font-medium leading-tight mt-0 mb-2 text-600">Description</label>
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
                id="description"
                rows="3"
                placeholder="Description"
                value={values.description}
                onChange={handleChange}
                ></textarea>
                </div>
                <div className="form-group mb-6">
                <label className="text-2xl font-medium leading-tight mt-0 mb-2 text-600">Picture path</label>
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
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="picture_path"
                    placeholder="Picture path" onChange={handleChange} value={values.picture_path}/>
                </div>
                <label className="text-2xl font-medium leading-tight mt-0 mb-2 text-600">Castings</label>
                {
                    values.movies.map(movie => (
                        <div key={movie.id} className='p-4'>
                            <input type="checkbox" onClick={handleCastingChange} id={movie.id} checked={movie.selected}/>
                            <h6 className="text-base font-medium leading-tight mt-0 mb-2 text-600 inline">{movie.title}</h6>
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
                    canDelete && <button onClick={deleteActor} className="
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

export default ActorForm;
