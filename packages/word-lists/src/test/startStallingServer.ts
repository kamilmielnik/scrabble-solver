import { afterAll } from 'bun:test';
import net, { type AddressInfo } from 'net';

/** Accepts the request, sends `partialResponse` and then stays silent, which is what a stalled upstream looks like. */
export async function startStallingServer(partialResponse = ''): Promise<string> {
  const server = net.createServer(stallAfterPartialResponse);
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  afterAll(() => {
    server.close();
  });

  return `http://127.0.0.1:${(server.address() as AddressInfo).port}/`;

  function stallAfterPartialResponse(socket: net.Socket): void {
    socket.on('error', () => undefined);
    socket.once('data', () => {
      socket.write(partialResponse);
    });
  }
}
