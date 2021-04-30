import { gql } from '@apollo/client';

export const GET_PODCASTS = (authorCuid: string) => gql`
  query{
    podcasts(authorCuid: "${authorCuid}") {
      cuid
		  name
		  description
    }
  }
`;

export const GET_EPISODES = (podcastCuid: string) => gql`
  query {
    episodes(podcastCuid: "${podcastCuid}") {
      cuid
      title
      content
    }
  }
`;
