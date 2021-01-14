const URL = '/api/visit';

const visit = (): Promise<Response> => {
  return fetch(URL, {
    method: 'PUT',
  });
};

export default visit;
