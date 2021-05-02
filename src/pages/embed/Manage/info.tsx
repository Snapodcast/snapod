import React from 'react';
import * as Store from '../../../lib/Store';
import { useQuery } from '@apollo/client';
import { GET_PODCAST } from '../../../lib/GraphQL/queries';

export default function ManagePodcast() {
  const podcastCuid = Store.get('currentPodcast.cuid');
  const { loading, error, data } = useQuery(GET_PODCAST, {
    variables: { podcastCuid },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="flex gap-x-3">
      <div>
        <button
          aria-label="upload image"
          type="button"
          className="bg-gray-100 rounded-md h-48 w-48 flex items-center justify-center flex-2 shadow-md"
          style={{
            backgroundImage: `url(${data.podcast.profile.cover_art_image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>
      <div>
        <h1>{data.podcast.name}</h1>
        <p>{data.podcast.description}</p>
      </div>
    </div>
  );
}
