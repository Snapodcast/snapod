import * as Store from '../lib/Store';

const logout = () => {
  Store.remove('currentUser');
  Store.remove('currentPodcast');
};

export default logout;
