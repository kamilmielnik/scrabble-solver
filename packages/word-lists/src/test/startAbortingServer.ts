import { afterAll } from 'bun:test';
import net, { type AddressInfo } from 'net';

const ANNOUNCED_BODY_SIZE = 1000;

/** Bun.serve cannot promise a body and then cut it off, which is what a dropped download looks like to the client. */
export async function startAbortingServer(partialBody: string): Promise<string> {
  const server = net.createServer(abortAfterPartialBody);
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  afterAll(() => {
    server.close();
  });

  return `http://127.0.0.1:${(server.address() as AddressInfo).port}/`;

  function abortAfterPartialBody(socket: net.Socket): void {
    socket.on('error', () => undefined);
    socket.once('data', () => {
      socket.write(`HTTP/1.1 200 OK\r\nContent-Length: ${ANNOUNCED_BODY_SIZE}\r\n\r\n${partialBody}`, () => {
        socket.destroy();
      });
    });
  }
}
