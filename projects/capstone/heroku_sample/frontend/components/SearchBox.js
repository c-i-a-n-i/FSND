
import { Formik, Field, Form } from 'formik';
import HeaderItem from "./HeaderItem";
import { SearchIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { useRouter } from "next/router";

export default function SearchBox() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const onActorsPage = router.pathname === "/actors";
    const searchBox = (
      <div >
        <Formik
          initialValues={{
            searchTerm: '',
          }}

          onSubmit={(
            values,
            { setSubmitting }
          ) => {
            setTimeout(() => {
              onActorsPage
              ?router.push(`/actors/?searchTerm=${values.searchTerm}`)
              :router.push(`/?searchTerm=${values.searchTerm}`)
              setSubmitting(false);
            }, 500);
          }}

        >
          <Form>
            <div className="mb-3">
              <Field className="form-control p-2 text-black" id="searchTerm" name="searchTerm" placeholder={onActorsPage? "Search Actors": "Search Movies"} aria-describedby="search term"  onBlur={() => setOpen(!open)}/>
            </div>
          </Form>
        </Formik>
      </div>
    );

    const searchIcon = <div onClick={() => setOpen(!open)}>
        <HeaderItem title='SEARCH' Icon={SearchIcon} />
        </div>
    
    return open? searchBox: searchIcon;
    
  };