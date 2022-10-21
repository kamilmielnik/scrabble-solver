import { registerRoute } from 'workbox-routing';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
};

const routeSolveRequests = () => {
  registerRoute(
    ({ url }) => url.pathname === '/api/solve',
    async () => {
      const response = {};
      const json = JSON.stringify(response);
      return new Response(json, { headers });
    },
    'POST',
  );
};

export default routeSolveRequests;
