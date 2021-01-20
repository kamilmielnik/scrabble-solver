const visit = (): Promise<Response> => {
  return fetch('/api/visit', {
    method: 'PUT',
  });
};

export default visit;
