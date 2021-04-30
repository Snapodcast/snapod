import * as Store from '../lib/Store';

const logout = () => {
  console.log(Store.get('currentUser.token'));
  Store.remove('currentUser');
  console.log(Store.get('currentUser.token'));
};

export default logout;
