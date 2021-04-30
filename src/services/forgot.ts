import Config from '../configs';

export const forgotRequest = (email: string): Promise<any> => {
  return fetch(`${Config.backend_url}/forgot/request`, {
    credentials: 'include',
    body: JSON.stringify({
      email,
    }),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  });
};

export const forgotRecover = (code: string, password: string): Promise<any> => {
  return fetch(`${Config.backend_url}/forgot/recover`, {
    credentials: 'include',
    body: JSON.stringify({
      code,
      password,
    }),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  });
};
