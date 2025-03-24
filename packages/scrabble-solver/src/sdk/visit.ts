export const visit = (): Promise<Response> => {
  return fetch('/api/visit', {
    method: 'PUT',
  });
};
