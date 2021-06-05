import { gql } from '@apollo/client';

/* Podcasts */
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
      id
      name
      description
      type
      profile {
        language
        category_name
        clean_content
        cover_art_image_url
        ownerName
        ownerEmail
        copyright
        block
        complete
        new_feed_url
        apple_podcasts_code
        apple_podcasts_url
        google_podcasts_url
        breaker_url
        castbox_url
        overcast_url
        pocketcast_url
        radiopublic_url
        spotify
        netease_url
        qqmusic_url
        ximalaya_url
        xiaoyuzhou_url
        website_url
      }
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
          category_name: $category
          clean_content: $contentClean
          cover_art_image_url: $coverImageUrl
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

export const MODIFY_PODCAST = gql`
  mutation ModifyPodcast(
    $podcastCuid: String!
    $name: String
    $description: String
    $type: String
    $language: String
    $category_name: String
    $clean_content: Boolean
    $ownerName: String
    $ownerEmail: String
    $cover_art_image_url: String
    $copyright: String
    $block: Boolean
    $complete: Boolean
    $new_feed_url: String
    $apple_podcasts_code: String
    $apple_podcasts_url: String
    $google_podcasts_url: String
    $breaker_url: String
    $castbox_url: String
    $overcast_url: String
    $pocketcast_url: String
    $radiopublic_url: String
    $spotify: String
    $netease_url: String
    $qqmusic_url: String
    $ximalaya_url: String
    $xiaoyuzhou_url: String
    $website_url: String
    $snapod_site_url: String
    $snapod_site_custom_url: String
  ) {
    modifyPodcast(
      podcastCuid: $podcastCuid
      info: { name: $name, description: $description, type: $type }
      profile: {
        language: $language
        category_name: $category_name
        clean_content: $clean_content
        cover_art_image_url: $cover_art_image_url
        ownerName: $ownerName
        ownerEmail: $ownerEmail
        copyright: $copyright
        block: $block
        complete: $complete
        new_feed_url: $new_feed_url
        apple_podcasts_code: $apple_podcasts_code
        apple_podcasts_url: $apple_podcasts_url
        google_podcasts_url: $google_podcasts_url
        breaker_url: $breaker_url
        castbox_url: $castbox_url
        overcast_url: $overcast_url
        pocketcast_url: $pocketcast_url
        radiopublic_url: $radiopublic_url
        spotify: $spotify
        netease_url: $netease_url
        qqmusic_url: $qqmusic_url
        ximalaya_url: $ximalaya_url
        xiaoyuzhou_url: $xiaoyuzhou_url
        website_url: $website_url
        snapod_site_url: $snapod_site_url
        snapod_site_custom_url: $snapod_site_custom_url
      }
    ) {
      name
    }
  }
`;

export const DELETE_PODCAST = gql`
  mutation DeletePodcast($podcastCuid: String!) {
    deletePodcast(podcastCuid: $podcastCuid) {
      status
    }
  }
`;

/* Episodes */
export const CREATE_EPISODE = gql`
  mutation CreateEpisode(
    $podcastCuid: String!
    $title: String!
    $content: String!
    $audio_url: String!
    $audio_size: Float!
    $audio_duration: String!
    $episode_type: String!
    $clean_content: Boolean!
    $season_number: Float
    $episode_number: Float!
    $published: Boolean!
    $cover_art_image_url: String
  ) {
    createEpisode(
      podcastCuid: $podcastCuid
      data: {
        title: $title
        content: $content
        published: $published
        profile: {
          audio_url: $audio_url
          audio_duration: $audio_duration
          audio_size: $audio_size
          episode_type: $episode_type
          clean_content: $clean_content
          season_number: $season_number
          episode_number: $episode_number
          cover_art_image_url: $cover_art_image_url
        }
      }
    ) {
      cuid
    }
  }
`;

export const GET_EPISODES = gql`
  query Episodes($podcastCuid: String!) {
    episodes(podcastCuid: $podcastCuid) {
      cuid
      title
      content
      createdAt
      published
      profile {
        cover_art_image_url
        episode_number
        season_number
        episode_type
        audio_duration
      }
    }
  }
`;

export const GET_EPISODES_TITLE = gql`
  query EpisodesTitle($podcastCuid: String!) {
    episodes(podcastCuid: $podcastCuid) {
      cuid
      title
    }
  }
`;

export const GET_EPISODE = gql`
  query Episode($episodeCuid: String!) {
    episode(episodeCuid: $episodeCuid) {
      title
      content
      createdAt
      published
      profile {
        audio_url
        audio_duration
        audio_size
        cover_art_image_url
        episode_type
        clean_content
        season_number
        episode_number
      }
    }
  }
`;

export const MODIFY_EPISODE = gql`
  mutation ModifyEpisode(
    $episodeCuid: String!
    $title: String
    $content: String
    $published: Boolean
    $audio_url: String
    $audio_duration: String
    $audio_size: Float
    $cover_art_image_url: String
    $episode_type: String
    $clean_content: Boolean
    $season_number: Float
    $episode_number: Float
  ) {
    modifyEpisode(
      episodeCuid: $episodeCuid
      info: { title: $title, content: $content, published: $published }
      profile: {
        audio_url: $audio_url
        audio_duration: $audio_duration
        audio_size: $audio_size
        episode_type: $episode_type
        clean_content: $clean_content
        season_number: $season_number
        episode_number: $episode_number
        cover_art_image_url: $cover_art_image_url
      }
    ) {
      status
    }
  }
`;

export const DELETE_EPISODE = gql`
  mutation DeleteEpisode($episodeCuid: String!) {
    deleteEpisode(episodeCuid: $episodeCuid) {
      status
    }
  }
`;

export const GET_SITE = gql`
  query Podcast($podcastCuid: String!) {
    podcast(podcastCuid: $podcastCuid) {
      id
      profile {
        snapod_site_url
        snapod_site_custom_url
      }
    }
  }
`;

export const MODIFY_CUSTOM_DOMAIN = gql`
  mutation ModifyCustomDomain($podcastCuid: String!, $customDomain: String!) {
    modifyCustomDomain(podcastCuid: $podcastCuid, customDomain: $customDomain) {
      status
    }
  }
`;

export const IMPORT_PODCAST = gql`
  mutation ImportPodcast($authorCuid: String!, $podcastRssUrl: String!) {
    importPodcast(authorCuid: $authorCuid, podcastRssUrl: $podcastRssUrl) {
      status
    }
  }
`;
