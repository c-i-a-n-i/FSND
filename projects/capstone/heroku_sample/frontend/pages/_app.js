import { useState, createContext } from 'react';
import { Auth0Provider } from "@auth0/auth0-react";
import '../styles/globals.css'

export const defaults = {
  movie: {
    title: "",
    overview: "",
    genre: "",
    release_date: "",
    first_air_date: "",
    rating: 0,
    backdrop_path: "",
    poster_path: "",
    actors: []
  },
  actor: {
    name: "",
    dob: "",
    gender: "",
    description: "",
    picture_path: "",
    movies: []
  },
  app: {
    apiUrl: "http://localhost:5000",
    appUrl: "http://localhost:3000",
    domain: "dev-fuqidc7q.us.auth0.com",
    clientId: "CbiMz4LueEFw9elVtdaibnLbXa89tFGA",
    audience: "movie",
    accessToken: "",
    permissions: []
  }
};

//also pass the base url through here
export const MovieFormContext = createContext();
export const ActorFormContext = createContext();
export const AppContext = createContext();

function MyApp({ Component, pageProps }) {
  // Just invented the best way to use react context: create a global state to store each context, then pass in both the state and its setter to its consumers
  const [movieForm, setMovieForm] = useState(defaults.movie);
  const [actorForm, setActorForm] = useState(defaults.actor);
  const [appContext, setappContext] = useState(defaults.app);

  return (
    <Auth0Provider
    domain={appContext.domain}
    clientId={appContext.clientId}
    redirectUri={appContext.appUrl}
    audience={appContext.audience}
    scope={appContext.scope}
  >
      <AppContext.Provider value={{appContext, setappContext}}>
        <MovieFormContext.Provider value={{movieForm, setMovieForm}}>
          <ActorFormContext.Provider value={{actorForm, setActorForm}}>
            <Component {...pageProps} />
          </ActorFormContext.Provider>
        </MovieFormContext.Provider>
      </AppContext.Provider>
    </Auth0Provider>
  );

}

export default MyApp
