import React, { useState, useContext } from 'react';
import { useRouter } from "next/router";
import { AppContext } from './_app';

function ActorForm() {
    const {appContext} = useContext(AppContext)
    const BASE_URL = appContext.apiUrl

    const [values, setValues] = useState({
        name: "",
        dob: "",
        gender: "",
        description: "",
        picture_path: "",
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
            `${BASE_URL}/actors`, options
          ).then((res) => res.json());

        if(request.success){
            alert("Successfully added the actor")
        }else{
            alert("Failed to add the actor")
        }

        router.push('/actors')
    }
    
    const handleChange = event =>{
        setValues({...values, [event.target.id]: event.target.value})
    }
  return <div className="p-10 w-1/2">
            <h1 className="text-5xl font-medium leading-tight mt-0 mb-2 text-600">Add actor</h1>
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
                    placeholder="Name" onChange={handleChange}/>
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
                    onChange={handleChange}/>
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
                    placeholder="Gender" onChange={handleChange}/>
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
                    placeholder="Picture path" onChange={handleChange}/>
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

export default ActorForm;
