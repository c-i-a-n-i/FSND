import {
    BadgeCheckIcon,
    DocumentAddIcon,
    HomeIcon,
    UserAddIcon,
    UserIcon,
} from '@heroicons/react/outline';

import Image from "next/image";
import Link from 'next/link'
import HeaderItem from "./HeaderItem";
import SearchBox from './SearchBox';
import { AppContext } from '../pages/_app';
import { useContext } from 'react';


function Header() {
  const {appContext} = useContext(AppContext)

  const canCreateActors = appContext.permissions.includes("post:actors")
  const canCreateMovies = appContext.permissions.includes("post:movies")

  return (
    <header className='flex flex-col-reverse sm:flex-row-reverse m-5 justify-between items-center'>
      <div className='flex flex-grow justify-evenly max-w-2xl'>
          <Link href="/">
            <a>
              <HeaderItem title='HOME' Icon={HomeIcon}/>
            </a>
          </Link>
          <Link href="/actors">
            <a>
              <HeaderItem title='ACTORS' Icon={BadgeCheckIcon}/>
            </a>
          </Link>
          {
            canCreateActors && <Link href="/new_actor">
            <a>
              <HeaderItem title='+ ACTOR' Icon={UserAddIcon}/>
            </a>
          </Link>
          }
          {
            canCreateMovies && <Link href="/new_movie">
            <a>
              <HeaderItem title='+ MOVIE' Icon={DocumentAddIcon}/>
            </a>
          </Link>
          }
         <SearchBox/>
          <Link href="/account">
            <a>
            <HeaderItem title='ACCOUNT' Icon={UserIcon}/>
            </a>
          </Link>
      </div>
      <Image
        src="https://links.papareact.com/ua6"
        width={200}
        height={100}
        className="object-contain"
        alt="logo"
      />
    </header>
  );
}

export default Header;
