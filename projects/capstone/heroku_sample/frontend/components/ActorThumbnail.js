import Image from "next/image";
import { forwardRef, useContext } from "react";
import { useRouter } from "next/router";
import { AppContext, ActorFormContext } from '../pages/_app';

const ActorThumbnail = forwardRef(({ result }, ref) => {
  const {appContext} = useContext(AppContext)
  const {setActorForm} = useContext(ActorFormContext)
  const router = useRouter();

  const BASE_URL = appContext.apiUrl
  const headers = new Headers({
    'Authorization': `Bearer ${appContext.accessToken}`
  });

  const navigate = async () =>{
    const actorMovies = await fetch(
      `${BASE_URL}/actors/${result.id}`, {headers}
    ).then((res) => res.json());
    const actorMovieIds = actorMovies.movies.map(movie => movie.id);

    const allMovies = await fetch(
      `${BASE_URL}/movies`, {headers}
    ).then((res) => res.json());
    
    const movies = allMovies.movies.map(movie => {
      const selected = actorMovieIds.includes(movie.id)
      return {...movie, selected}
    });
    setActorForm({...result, movies})  //set the context for when we navigate to the form page
    router.push(`/edit_actor`)
  }

  return (
    <div ref={ref} className="group cursor-pointer p-2 transition duration-200 ease-in transform sm:hover:scale-105 hover:z-50" onClick={navigate}>
    <figure className="bg-slate-100 rounded-xl p-8 dark:bg-slate-800">
    <Image
        className="w-24 h-24 rounded-full mx-auto"
        layout="responsive"
        height={1080}
        width={1920}
        src={
          `${result.picture_path}`
        }
        alt="avatar"
      />
    <div className="pt-6 space-y-4">
        <blockquote>
        <p className="text-lg font-medium">
            {result.description}
        </p>
        </blockquote>
        <figcaption className="font-medium">
        <div className="text-sky-500 dark:text-sky-400">
            {result.name}
        </div>
        <div className="text-slate-700 dark:text-slate-500">
            {result.gender}•{" "}{result.dob}
        </div>
        </figcaption>
    </div>
    </figure>
    </div>
  );
});

ActorThumbnail.displayName = 'ActorThumbnail';
export default ActorThumbnail;
