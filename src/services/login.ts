import Config from '../configs';

const login = (email: string, password: string): Promise<any> => {
  return fetch(`${Config.backend_url}/login`, {
    credentials: 'include',
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  });
};

export default login;
