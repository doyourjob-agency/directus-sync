import { createApp } from '@directus/api';
import { startServer as startLicenseServer } from '@directus/mock-license-server';
import { Subject } from 'rxjs';
import getenv from 'getenv';

let serverIsRunning = false;
let licenseServerIsRunning = false;

export async function startServer(): Promise<Subject<void>> {
  // Ensure no more than one server is running
  if (serverIsRunning) {
    throw new Error('A server is already running');
  }

  serverIsRunning = true;

  // Create a subject to terminate the server
  const killer = new Subject<void>();

  // Directus 12 requires a license for some features (e.g. custom permission rules).
  // The mock license server cannot be stopped, so it is started only once.
  if (!licenseServerIsRunning) {
    await startLicenseServer();
    licenseServerIsRunning = true;
  }

  // Create the Directus server
  const app = await createApp();

  const port = getenv.int('PORT');
  const hostname = getenv.string('HOST');

  // Start the server
  const server = app
    .listen(port, hostname, () => {
      process.send?.('ready');
    })
    .once('error', (err: Error & { code: string }) => {
      serverIsRunning = false;
      if (err?.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
      }
      throw err;
    })
    .once('close', () => {
      serverIsRunning = false;
      killer.complete();
    });

  killer.subscribe(() => {
    server.close();
  });

  return killer;
}
