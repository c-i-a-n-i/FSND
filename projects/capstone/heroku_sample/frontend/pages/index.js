import Head from "next/head";
import Header from "../components/Header";
import Nav from "../components/Nav";
import Results from "../components/Results";
import { useAuth0 } from "@auth0/auth0-react";
import { AppContext } from './_app';
import { useContext, useEffect } from "react";
import { defaults } from "./_app";
import { decode } from "jsonwebtoken";

export default function Home( {results} ) {
  const { getAccessTokenSilently } = useAuth0();
  const {appContext, setappContext} = useContext(AppContext)

  useEffect(() => {
    const getJwtAccessToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: appContext.audience,
        });
        setappContext({...appContext, accessToken, permissions: decode(accessToken).permissions})
      } catch (e) {
        console.log(e.message);
      }
    };
  
    getJwtAccessToken();
  }, [getAccessTokenSilently]);

  return (
    <div>
      <Head>
        <title>Hulu 2.0</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Nav />
      <Results results={results} type={"movies"}/>
    </div>
  );
}

export async function getServerSideProps(context) {
  const baseUrl = `${defaults.app.apiUrl}/movies`
  const genre = context.query.genre === 'All'? '': context.query.genre 
  const queryParams = {'genre': genre, 'searchTerm': context.query.searchTerm}
  const ret = [];
  for (let d in queryParams){
    queryParams[d] && ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(queryParams[d]));
  }
  let queryString = ret.join('&');
  
  if (queryString.length > 0)
    queryString = '?' + queryString

  const request = await fetch(
    baseUrl + queryString
  ).then((res) => res.json());

  return {
    props: {
      results: request.movies?? [],
    },
  };
}
