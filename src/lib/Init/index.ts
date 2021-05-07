import * as Store from '../Store';

export default function podcastInit(podcast: {
  name: string;
  cuid: string;
  profile: { new_feed_url?: string; apple_podcasts_url?: string };
}) {
  Store.set('currentPodcast.name', podcast.name);
  Store.set('currentPodcast.cuid', podcast.cuid);
  if (podcast.profile.new_feed_url) {
    Store.set('currentPodcast.newFeedURL', podcast.profile.new_feed_url);
  }
  if (podcast.profile.apple_podcasts_url) {
    Store.set(
      'currentPodcast.appleAuthCode',
      podcast.profile.apple_podcasts_url
    );
  }
}
