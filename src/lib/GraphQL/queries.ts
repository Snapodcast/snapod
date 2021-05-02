import { gql } from '@apollo/client';

export const GET_PODCASTS = gql`
  query Podcasts($authorCuid: String!) {
    podcasts(authorCuid: $authorCuid) {
      cuid
      name
      description
      profile {
        cover_art_image_url
      }
    }
  }
`;

export const GET_PODCAST = gql`
  query Podcast($podcastCuid: String!) {
    podcast(podcastCuid: $podcastCuid) {
      cuid
      name
      description
      type
      profile {
        cover_art_image_url
        category_name
        clean_content
        language
        copyright
        ownerName
        ownerEmail
        block
        complete
        new_feed_url
      }
    }
  }
`;

export const GET_EPISODES = gql`
  query Episodes($podcastCuid: String!) {
    episodes(podcastCuid: $podcastCuid) {
      cuid
      title
      content
    }
  }
`;

export const CREATE_PODCAST = gql`
  mutation CreatePodcast(
    $authorCuid: String!
    $name: String!
    $description: String!
    $type: String!
    $language: String!
    $category: String!
    $contentClean: Boolean!
    $coverImageUrl: String!
    $copyright: String
    $ownerName: String
    $ownerEmail: String
  ) {
    createPodcast(
      authorCuid: $authorCuid
      data: {
        name: $name
        description: $description
        type: $type
        profile: {
          language: $language
          category: $category
          contentClean: $contentClean
          coverImageUrl: $coverImageUrl
          ownerName: $ownerName
          ownerEmail: $ownerEmail
          copyright: $copyright
        }
      }
    ) {
      cuid
      name
    }
  }
`;
