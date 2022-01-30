
import { useAuth0 } from "@auth0/auth0-react";
import { AppContext } from '../pages/_app';
import { useContext } from "react";

export default function LoginForm() {
  const { loginWithRedirect, logout, user, isAuthenticated} = useAuth0();
  const {appContext} = useContext(AppContext)

  return (
    <div className="flex justify-center items-center h-screen" >
      {
          isAuthenticated && (
          <div>
            <img src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            
          </div>
        )
      }
      <button onClick={() => loginWithRedirect()} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full">Log in</button>
      <button onClick={() => logout({ returnTo: appContext.appUrl })} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full">Log out</button>

    </div>
  );
  };

