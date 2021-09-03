import React from 'react';
import { Link } from 'react-router-dom';
import Head from '../../../components/Head';
import Icons from '../../../components/Icons';

export default function Start() {
  return (
    <div className="h-full flex justify-center items-center">
      <Head title="Snapod" description="Grow your podcast with ease" />
      <div className="h-full w-full grid grid-cols-2 gap-x-3">
        <Link to="/landing/create/podcast">
          <div className="transition-colors col-auto bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-900 h-full rounded-md text-center items-center justify-center flex">
            <div>
              <div className="w-20 h-20 mx-auto text-green-500">
                <Icons name="add" />
              </div>
              <p className="text-green-500 font-medium">Create a new podcast</p>
            </div>
          </div>
        </Link>
        <Link to="/snapod/create/episode">
          <div className="transition-colors col-auto bg-yellow-100 dark:bg-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-900 h-full rounded-md text-center items-center justify-center flex">
            <div>
              <div className="w-20 h-20 mx-auto text-yellow-500">
                <Icons name="addEpisode" />
              </div>
              <p className="text-yellow-500 font-medium">
                Create a new episode
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
