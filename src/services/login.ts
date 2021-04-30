import Config from '../configs';
import qs from 'qs';

const login = (email: string, password: string): Promise<any> => {
  return fetch(
    `${Config.backend_url}/login?${qs.stringify({
      email,
      password,
    })}`,
    {
      credentials: 'include',
    }
  );
};

export default login;
