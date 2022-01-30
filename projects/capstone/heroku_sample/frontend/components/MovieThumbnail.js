import Image from "next/image";
import { ThumbUpIcon } from '@heroicons/react/outline';
import { forwardRef, useContext } from "react";
import { useRouter } from "next/router";
import { AppContext, MovieFormContext } from '../pages/_app';

const MoiveThumbnail = forwardRef(({ result }, ref) => {
  const {appContext} = useContext(AppContext)
  const {setMovieForm} = useContext(MovieFormContext)
  const router = useRouter();

  const BASE_URL = appContext.apiUrl
  const headers = new Headers({
    'Authorization': `Bearer ${appContext.accessToken}`
  });
  
  const navigate = async () =>{
    const movieActors = await fetch(
      `${BASE_URL}/movies/${result.id}`, {headers}
    ).then((res) => res.json());
    const movieActorIds = movieActors.actors.map(actor => actor.id);
  
    const allActors = await fetch(
      `${BASE_URL}/actors`, {headers}
    ).then((res) => res.json());
    
    const actors = allActors.actors.map(actor => {
      const selected = movieActorIds.includes(actor.id)
      return {...actor, selected}
    });
    setMovieForm({...result, actors})  //set the context for when we navigate to the form page
    router.push(`/edit_movie`)
  }
  
  return (
    <div ref={ref} className="group cursor-pointer p-2 transition duration-200 ease-in transform sm:hover:scale-105 hover:z-50"  onClick={navigate}>
      <Image
        layout="responsive"
        height={1080}
        width={1920}
        src={
          `${result.backdrop_path || result.poster_path}`
        }
        alt="poster"
      />
      <div className='p-2'>
          <p className="truncate max-w-md">{result.overview}</p>

          <h2 className="mt-1 text-2xl text-white transition-all duration-100 ease-in-out group-hover:font-bold">{result.title}</h2>

          <p className="flex items-center opacity-0 group-hover:opacity-100">
              {result.genre && `${result.genre} •`}{" "}
              {result.release_date || result.first_air_date} •{" "}
              <ThumbUpIcon className="h-5 mx-2"/> {result.rating}
          </p>
      </div>
    </div>
  );
});

MoiveThumbnail.displayName = 'MovieThumbnail';
export default MoiveThumbnail;
