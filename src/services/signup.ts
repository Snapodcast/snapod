import Config from '../configs';

const signup = (
  name: string,
  email: string,
  password: string
): Promise<any> => {
  return fetch(`${Config.backend_url}/signup`, {
    credentials: 'include',
    body: JSON.stringify({
      name,
      email,
      password,
    }),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  });
};

export default signup;
